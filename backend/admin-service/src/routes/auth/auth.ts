import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { ErrKind, LocalError } from 'plugins/error/error'
import { RouteCommonOptions } from 'routes/commonOptions'
import { authSchema, type loginRequestBody, type registerRequestBody } from './schema'
import bcrypt from 'bcrypt'
import { REFRESH_TOKEN_COOKIE } from 'plugins/jwt/jwt'
import { ADMIN_ACTIVE } from 'schemas/user'

export const authRoutes = fp((fastify, options: RouteCommonOptions) => {
    fastify.route({
        method: 'POST',
        url: `${options.prefix}/login`,
        schema: authSchema.login,
        handler: login,
    })
    async function login(req: FastifyRequest<{ Body: loginRequestBody }>, reply: FastifyReply) {
        const { credential, password } = req.body
        const user = await fastify.prismaW.user.findFirst({
            where: {
                ...ADMIN_ACTIVE,
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
            const resp = user.toUserResponse(token)

            reply.status(200).send(resp)
        } else {
            throw new LocalError(ErrKind.UserNotFound, 401)
        }
    }


    fastify.route({
        method: 'POST',
        url: `${options.prefix}/register`,
        schema: authSchema.register,
        onRequest: [fastify.authenticate], // only a admin can create admin
        handler: register,
    })
    async function register(req: FastifyRequest<{ Body: registerRequestBody }>, reply: FastifyReply) {
        const { email, password, username } = req.body
        const hashRounds = parseInt(process.env.BCRYPT_HASH_RONUDS!) || 10

        const hashedPassword = await bcrypt.hash(password, hashRounds)
        
        const user = await fastify.prismaW.user.create({
            data: { 
                email, 
                username,
                password: hashedPassword,
                role: 'ADMIN'
            }
        })

        const claims = user.getJwtClaims()
        fastify.generateRefreshTokenCookie(claims, reply)
        const token = fastify.generateAccessToken(claims)
        const resp = user.toUserResponse(token)

        reply.status(200).send(resp)
    }

    
    fastify.route({
        method: 'GET',
        url: `${options.prefix}/user`,
        schema: authSchema.user,
        onRequest: [fastify.authenticate],
        handler: userProfile,
    })
    async function userProfile(req: FastifyRequest, reply: FastifyReply) {
        const user = await fastify.prismaW.user.findFirst({ 
            where: { id: req.user.userId, ...ADMIN_ACTIVE }
        })
        reply.status(200).send(user!.toUserResponse())
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

