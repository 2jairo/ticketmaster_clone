import { ErrKind, LocalError } from 'plugins/error/error'
import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken'
import fp from 'fastify-plugin'
import { UserRole } from 'generated/prisma/enums';
import { ADMIN_ROOT_ACTIVE } from 'schemas/user';

export type JwtClaims = {
    userId: string
    v: number
    role: UserRole
}

declare module "fastify" {
    interface FastifyRequest {
        user: JwtClaims
    }

    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
        authenticateOptional: (request: FastifyRequest, reply: FastifyReply) => Promise<void>

        generateAccessToken: (claims: JwtClaims) => string
        generateRefreshTokenCookie: (claims: JwtClaims, reply: FastifyReply) => void

        authenticateAccessToken: (accessToken: string) => Promise<JwtClaims>
        authenticateRefreshToken: (refreshToken: string) => Promise<JwtClaims>
    }
}

export const REFRESH_TOKEN_COOKIE = 'jid'

export const jwtPlugin = fp((fastify) => {
    const authenticateInner = async (req: FastifyRequest, reply: FastifyReply, optional: boolean) => {
        const authHeader = (req.headers.authorization || req.headers.Authorization)?.toString()

        if (!authHeader || !authHeader?.startsWith('Bearer ')) {
            if (optional) {
                return
            }
            throw new LocalError(ErrKind.Unauthorized, 401)
        }

        const accessToken = authHeader.split(' ')[1]!
        const claims = await fastify.authenticateAccessToken(accessToken)

        const user = await fastify.prismaW.user.findFirst({ 
            where: { id: claims.userId, ...ADMIN_ROOT_ACTIVE }
        })
        if(!user || user.v !== claims.v) {
            throw new LocalError(ErrKind.Unauthorized, 401)
        }

        req.user = claims
    }

    fastify.decorate('authenticate', async (req, reply) => {
        return authenticateInner(req, reply, false)
    })

    fastify.decorate('authenticateOptional', async (req, reply) => {
        return authenticateInner(req, reply, true)
    })

    fastify.decorate('generateAccessToken', (claims) => {
        //@ts-ignore
        return jwt.sign(
            claims,
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: `${process.env.JWT_ACCESS_EXPIRES_IN_HOURS!}h` }
        )
    })

    fastify.decorate('generateRefreshTokenCookie', (claims, reply) => {
        //@ts-ignore
        const token = jwt.sign(
            claims,
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: `${process.env.JWT_REFRESH_EXPIRES_IN_DAYS!}d` }
        ) as string

        reply.setCookie(REFRESH_TOKEN_COOKIE, token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_DAYS!) * 24 * 60 * 60,
        })
    })

    fastify.decorate('authenticateAccessToken', (accessToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(
                accessToken,
                process.env.JWT_ACCESS_SECRET!,
                (err, decoded) => {
                    if (err) {
                        console.log(err)
                        reject(new LocalError(ErrKind.ExpiredAccessToken, 401))
                    }
                    else {
                        const d = decoded as JwtClaims
                        resolve({
                            userId: d.userId,
                            v: d.v,
                            role: d.role
                        })
                    }
                }
            )
        })
    })

    fastify.decorate('authenticateRefreshToken', async (refreshToken: string) => {
        return new Promise((resolve, reject) => {
            jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET!,
                (err, decoded) => {
                    if (err) {
                        reject(new LocalError(ErrKind.ExpiredRefreshToken, 401))
                    }
                    else {
                        const d = decoded as JwtClaims
                        resolve({
                            userId: d.userId,
                            v: d.v,
                            role: d.role
                        })
                    }
                }
            )
        })
    })
})

