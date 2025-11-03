import { getPrismaClientConfig } from 'config/config'
import fp from 'fastify-plugin'
import { PrismaClient } from 'generated/prisma/client'
import { adminModelWrapper } from 'schemas/admin'
import { musicGroupWrapper } from 'schemas/musicGroup'
import { ModelWrapper, PrismaModelWrappers } from 'schemas/wrapper'

declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient
        prismaW: {
            [K in keyof PrismaModelWrappers]: ModelWrapper<K, PrismaModelWrappers[K]>
        }
    }
}

export const prismaClientPlugin = fp(async (fastify) => {
    const prisma = new PrismaClient(getPrismaClientConfig())
    // .$extends({
    //     name: 'ext',
    //     query: {
    //         $allModels: {
    //             $allOperations: async ({ args, model, operation, query }) => {
    //                 if(operation.startsWith('find')) {
                        
    //                 }
    //             }
    //         },
    //     },
    //     result: {
    //         admin: {
    //             toUserProfile: {
    //                 compute(u) {
    //                     return () => ({
    //                         test: u.email
    //                     })
    //                 },
    //             },
    //         }
    //     }
    // })

    fastify.decorate('prisma', prisma)
    fastify.decorate('prismaW', {
        admin: new ModelWrapper(prisma, 'admin', (v) => adminModelWrapper(v)),
        musicGroup: new ModelWrapper(prisma, 'musicGroup', (v) => musicGroupWrapper(v))
    })
})