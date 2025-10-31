import Fastify from 'fastify'
import { PrismaClient } from './generated/prisma/client'
import process from 'process'
import dotenv from 'dotenv'

dotenv.config()
const fastify = Fastify()

async function main() {
    const prisma = new PrismaClient()

    try {
        await fastify.listen({ port: 3001 })
        console.log('Server running in http://localhost:3001');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

main()