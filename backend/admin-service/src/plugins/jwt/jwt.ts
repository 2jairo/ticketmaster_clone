import { ErrKind, LocalError } from 'plugins/error/error'
import { FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken'
import fp from 'fastify-plugin'

export type JwtClaims = {
    userId: string
    v: number
}

declare module "fastify" {
    interface FastifyRequest {
        user: JwtClaims
    }

    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
        authenticateOptional: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
        generateToken: (claims: JwtClaims) => string
    }
}


export const jwtPlugin = fp((fastify) => {
    fastify.decorate('authenticate', async (req, reply) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new LocalError(ErrKind.Unauthorized, 401)
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtClaims
            req.user = decoded;
        } catch (err) {
            throw new LocalError(ErrKind.Unauthorized, 401)
        }
    })

    fastify.decorate('authenticateOptional', async (req, reply) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return;
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtClaims
            req.user = decoded;
        } catch {
        }
    })

    fastify.decorate('generateToken', (claims) => {
        // @ts-ignore
        return jwt.sign(
            claims,
            process.env.JWT_SECRET!,
            { expiresIn: `${process.env.JWT_EXPIRES_IN_HOURS!}h` }
        )
    })
})
