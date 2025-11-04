import Fastify from 'fastify'
import process from 'process'
import dotenv from 'dotenv'
import { getFastifyInstanceConfig, getFastifyListenConfig } from 'config/config'
import { errorHandler } from 'plugins/error/error'
import { authRoutes } from 'routes/auth/auth'
import { swaggerPlugin } from 'plugins/swagger/swagger'
import { prismaClientPlugin } from 'plugins/prisma/prisma'
import { jwtPlugin } from 'plugins/jwt/jwt'
import { corsPlugin } from 'plugins/cors/cors'
import fastifyCookie from '@fastify/cookie'

dotenv.config()

async function main() {
    const fastify = Fastify(getFastifyInstanceConfig())
    const config = getFastifyListenConfig()

    await fastify.register(errorHandler)
    await fastify.register(corsPlugin)
    await fastify.register(fastifyCookie)
    await fastify.register(jwtPlugin)
    await fastify.register(swaggerPlugin)
    await fastify.register(prismaClientPlugin)

    await fastify.register(authRoutes, { prefix: '/api/auth' })

    try {
        await fastify.listen(config)
        console.log(`Server running in http://${config.host}:${config.port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

main()