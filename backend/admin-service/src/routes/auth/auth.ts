import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { ErrKind, LocalError } from 'plugins/error/error'
import { RouteCommonOptions } from 'routes/commonOptions'
import { authSchema, type loginRequestBody, type registerRequestBody } from './schema'
import bcrypt from 'bcrypt'
import { ADMIN_MODEL_ACTIVE } from 'schemas/admin'
import { REFRESH_TOKEN_COOKIE } from 'plugins/jwt/jwt'

export const authRoutes = fp((fastify, options: RouteCommonOptions) => {
    fastify.route({
        method: 'POST',
        url: `${options.prefix}/login`,
        schema: authSchema.login,
        handler: login,
    })
    async function login(req: FastifyRequest<{ Body: loginRequestBody }>, reply: FastifyReply) {
        const { credential, password } = req.body
        const user = await fastify.prismaW.admin.findFirst({
            where: {
                OR: [
                    { username: credential },
                    { email: credential },
                ]
            }
        })

        if(!user) {
            throw new LocalError(ErrKind.UserNotFound, 404)
        } 

        const match = await bcrypt.compare(password, user.password || '')
        if(match) {
            const claims = user.getJwtClaims()
            fastify.generateRefreshTokenCookie(claims, reply)
            const token = fastify.generateAccessToken(claims)
            const resp = user.toProfileResponse(token)

            reply.status(200).send(resp)
        } else {
            throw new LocalError(ErrKind.UserNotFound, 401)
        }
    }


    fastify.route({
        method: 'POST',
        url: `${options.prefix}/register`,
        schema: authSchema.register,
        handler: register,
    })
    async function register(req: FastifyRequest<{ Body: registerRequestBody }>, reply: FastifyReply) {
        const { email, password, username } = req.body
        const hashRounds = parseInt(process.env.BCRYPT_HASH_RONUDS!) || 10

        const hashedPassword = await bcrypt.hash(password, hashRounds)
        
        const user = await fastify.prismaW.admin.create({
            data: { 
                email, 
                username,
                password: hashedPassword,
            }
        })

        const claims = user.getJwtClaims()
        fastify.generateRefreshTokenCookie(claims, reply)
        const token = fastify.generateAccessToken(claims)
        const resp = user.toProfileResponse(token)

        reply.status(200).send(resp)
    }

    
    fastify.route({
        method: 'POST',
        url: `${options.prefix}/profile`,
        schema: authSchema.profile,
        onRequest: [fastify.authenticate],
        handler: profile,
    })
    async function profile(req: FastifyRequest, reply: FastifyReply) {
        const user = await fastify.prismaW.admin.findFirst({ 
            where: { id: req.user.userId, ...ADMIN_MODEL_ACTIVE }
        })

        if(!user) {
            throw new LocalError(ErrKind.UserNotFound, 404)
        }
        reply.status(200).send(user.toProfileResponse())
    }


    fastify.route({
        method: 'POST',
        url: `${options.prefix}/logout`,
        handler: logout,
    })
    async function logout(req: FastifyRequest, reply: FastifyReply) {
        // //TODO: blacklist
        reply.clearCookie('refreshToken', { path: '/' })
        reply.status(200).send()
    }
 

    fastify.route({
        method: 'POST',
        url: `${options.prefix}/refresh`,
        handler: refreshAccessToken,
    })
    async function refreshAccessToken(req: FastifyRequest, reply: FastifyReply) {
        const refresh = req.cookies[REFRESH_TOKEN_COOKIE]
        if(!refresh) {
            throw new LocalError(ErrKind.ExpiredRefreshToken, 401)
        }

        const claims = await fastify.authenticateRefreshToken(refresh)
        const newAccess = fastify.generateAccessToken(claims)
        reply.status(200).send({ token: newAccess })
    }
})

