import { PrismaClientOptions } from "@prisma/client/runtime/library"
import type { FastifyBaseLogger, FastifyHttpOptions, FastifyListenOptions } from "fastify"
import { Prisma } from "generated/prisma/client"
import type { Server } from "http"

export const getFastifyListenConfig = (): FastifyListenOptions => {
    const port = parseInt(process.env.PORT!) || 3001

    return {
        port,
        host: process.env.HOST!,
    }
}

export const getFastifyInstanceConfig = (): FastifyHttpOptions<Server, FastifyBaseLogger> => {
    return {
        logger: true
    }
}



export const getPrismaClientConfig = (): Prisma.Subset<PrismaClientOptions, Prisma.PrismaClientOptions> => {
    return {

    }
}