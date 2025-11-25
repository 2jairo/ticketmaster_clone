import { FastifyInstance } from "fastify"
import { CategoryModel } from "generated/prisma/models"
import { CategoryStatus } from "generated/prisma/enums"

export const CATEGORY_STATUS: CategoryStatus[] = ['ACCEPTED', 'REJECTED', 'PENDING']

export type CategoryWrapper = ReturnType<typeof categoryWrapper>

export const categoryWrapper = (fastify: FastifyInstance, m: CategoryModel) => {
    const withConcertsLength = async () => {
        const concerts = await fastify.prisma.concert.count({
            where: {
                categories: {
                    has: m.id
                }
            }
        })

        return {
            ...m,
            concerts
        }
    }

    return {
        ...m,
        withConcertsLength
    }
}
