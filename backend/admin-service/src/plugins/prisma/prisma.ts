import { getPrismaClientConfig } from 'config/config'
import fp from 'fastify-plugin'
import { Prisma, PrismaClient } from 'generated/prisma/client'
import { userModelWrapper } from 'schemas/user'
import { musicGroupWrapper } from 'schemas/musicGroup'
import { ModelWrapper, PrismaModelWrappers } from 'schemas/wrapper'

declare module "fastify" {
    interface FastifyInstance {
        prisma: ExtendedPrismaClient,
        prismaW: {
            [K in keyof PrismaModelWrappers]: ModelWrapper<K, PrismaModelWrappers[K]>
        }
    }
}

export type ExtendedPrismaClient = ReturnType<typeof getPrismaClient>

const getPrismaClient = () => {
    const updateUserVersion = Prisma.defineExtension({
        name: 'update __v',
        query: {
            user: {
                $allOperations: async ({ args, operation, query }) => {
                    if (operation !== 'update' && operation !== 'updateMany') {
                        return query(args)
                    }

                    if(args.data.password || args.data.isActive !== undefined || args.data.role) {
                        args.data.v = { increment: 1 }
                    }
                    return query(args)
                }
            }
        }
    })

    return new PrismaClient(getPrismaClientConfig())
        .$extends(updateUserVersion)
}

export const prismaClientPlugin = fp(async (fastify) => {
    const prisma = getPrismaClient()
    await prisma.$connect()
    
    fastify.decorate('prisma', prisma)
    fastify.decorate('prismaW', {
        user: new ModelWrapper(prisma, 'user', (v) => userModelWrapper(v)),
        musicGroup: new ModelWrapper(prisma, 'musicGroup', (v) => musicGroupWrapper(v))
    })
})