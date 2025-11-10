import { getPrismaClientConfig } from 'config/config'
import fp from 'fastify-plugin'
import { Prisma, PrismaClient } from 'generated/prisma/client'
import { userModelWrapper } from 'schemas/user'
import { musicGroupWrapper } from 'schemas/musicGroup'
import { ModelWrapper, PrismaModelWrappers } from 'schemas/wrapper'
import slugify from 'slugify'

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

                    if (args.data.password || args.data.isActive !== undefined || args.data.role) {
                        args.data.v = { increment: 1 }
                    }
                    return query(args)
                }
            }
        }
    })

    const updateSlug = Prisma.defineExtension({
        name: 'update slug',
        query: {
            // category, musicGroup, concert
            $allOperations: ({ args, operation, model, query }) => {
                if (model !== 'Category' && model !== 'MusicGroup' && model !== 'Concert') return query(args)
                if (operation !== 'update' && operation !== 'updateMany' && operation !== 'create') return query(args)
                
                const value = typeof args.data.title !== 'string'
                    ? args.data.title?.set
                    : args.data.title

                if (!value) {
                    return query(args)
                }

                const slugifiedTitle = slugify(value)
                const uuid = crypto.randomUUID().replaceAll('-', '')
                args.data.slug = `${slugifiedTitle}-${uuid}`
                return query(args)
            }
        }
    })

    return new PrismaClient(getPrismaClientConfig())
        .$extends(updateUserVersion)
        .$extends(updateSlug)
}

export const prismaClientPlugin = fp(async (fastify) => {
    const prisma = getPrismaClient()
    await prisma.$connect()

    fastify.decorate('prisma', prisma)
    fastify.decorate('prismaW', {
        user: new ModelWrapper(prisma, 'user', (v) => userModelWrapper(fastify, v)),
        musicGroup: new ModelWrapper(prisma, 'musicGroup', (v) => musicGroupWrapper(fastify, v))
    })
})