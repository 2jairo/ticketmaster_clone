import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { ErrKind, LocalError } from 'plugins/error/error'
import { RouteCommonOptions } from 'types/routesCommon'
import { authSchema, updateUserInfoRequestBody, updateUserPasswordRequestBody, type loginRequestBody, type registerRequestBody } from './schema'
import bcrypt from 'bcrypt'
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
        const user = await fastify.prismaW.user.findFirst({
            where: {
                isActive: true,
                OR: [
                    { username: credential },
                    { email: credential },
                ]
            }
        })

        if (!user) {
            throw new LocalError(ErrKind.UserNotFound, 404)
        }

        const match = await bcrypt.compare(password, user.password || '')
        if (match) {
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
        onRequest: [fastify.authenticateOptional({})], // only a root can change role
        handler: register,
    })
    async function register(req: FastifyRequest<{ Body: registerRequestBody }>, reply: FastifyReply) {
        const { email, password, username, role = 'CLIENT' } = req.body
        const hashRounds = parseInt(process.env.BCRYPT_HASH_RONUDS!) || 10

        const hashedPassword = await bcrypt.hash(password, hashRounds)

        const userRole = req.user?.role === 'ROOT'
            ? role
            : 'CLIENT'

        const user = await fastify.prismaW.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                role: userRole
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
        onRequest: [fastify.authenticate({})],
        handler: userProfile,
    })
    async function userProfile(req: FastifyRequest, reply: FastifyReply) {
        const user = await fastify.prismaW.user.findFirst({
            where: { id: req.user.userId, isActive: true }
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
        url: `${options.prefix}/update`,
        onRequest: [fastify.authenticate({})],
        schema: authSchema.updateUserInfo,
        handler: updateUserInfo,
    })
    async function updateUserInfo(req: FastifyRequest<{ Body: updateUserInfoRequestBody }>, reply: FastifyReply) {
        const { userId = req.user.userId, ...rest } = req.body

        const idToFind = req.user.role === 'ROOT' ? userId : req.user.userId
        const updatedUser = await fastify.prismaW.user.update({
            where: { id: idToFind },
            data: rest
        })

        if(!updatedUser) {
            throw new LocalError(ErrKind.UserNotFound, 404)
        }
    
        const claims = updatedUser.getJwtClaims()
        fastify.generateRefreshTokenCookie(claims, reply)
        const token = fastify.generateAccessToken(claims)
        const resp = updatedUser.toUserResponse(token)
        reply.status(200).send(resp)
    }


    fastify.route({
        method: 'POST', 
        url: `${options.prefix}/update/password`,
        onRequest: [fastify.authenticate({})],
        schema: authSchema.updateUserPassword,
        handler: updateUserPassword,
    })
    async function updateUserPassword(req: FastifyRequest<{ Body: updateUserPasswordRequestBody }>, reply: FastifyReply) {
        const { new: newPassword, old: oldPassword, userId = req.user.userId } = req.body

        const idToFind = req.user.role === 'ROOT' ? userId : req.user.userId
        const user = await fastify.prismaW.user.findFirst({
            where: { id: idToFind }
        })
        if (!user) {
            throw new LocalError(ErrKind.UserNotFound, 404)
        }

        const match = req.user.role === 'ROOT'
            ? true
            : await bcrypt.compare(oldPassword, user.password || '')

        if (match) {
            const hashRounds = parseInt(process.env.BCRYPT_HASH_RONUDS!) || 10
            const hashedPassword = await bcrypt.hash(newPassword, hashRounds)
            user.password = hashedPassword

            const updatedUser = await fastify.prismaW.user.update({
                where: { id: user.id },
                data: user
            })

            const claims = updatedUser.getJwtClaims()
            fastify.generateRefreshTokenCookie(claims, reply)
            const token = fastify.generateAccessToken(claims)
            const resp = updatedUser.toUserResponse(token)
            reply.status(200).send(resp)
        } else {
            throw new LocalError(ErrKind.PasswordMismatch, 401)
        }
    }


    fastify.route({
        method: 'POST',
        url: `${options.prefix}/refresh`,
        handler: refreshAccessToken,
    })
    async function refreshAccessToken(req: FastifyRequest, reply: FastifyReply) {
        const refresh = req.cookies[REFRESH_TOKEN_COOKIE]
        if (!refresh) {
            throw new LocalError(ErrKind.ExpiredRefreshToken, 401)
        }

        const claims = await fastify.authenticateRefreshToken(refresh)
        const newAccess = fastify.generateAccessToken(claims)
        reply.status(200).send({ token: newAccess })
    }
})

