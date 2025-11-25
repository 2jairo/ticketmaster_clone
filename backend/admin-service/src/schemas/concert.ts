import { FastifyInstance } from "fastify";
import { ConcertModel } from "generated/prisma/models";
import { ConcertStatus } from "generated/prisma/enums";

export const CONCERT_STATUS: ConcertStatus[] = ['ACCEPTED', 'REJECTED', 'PENDING']

export type ConcertModelWrapper = ReturnType<typeof concertModelWrapper>

export const concertModelWrapper = (fastify: FastifyInstance, m: ConcertModel) => {
    const withPopulatedFields = async () => {
        // Fetch tickets
        const tickets = await fastify.prisma.concertTickets.findMany({
            where: {
                concertId: m.id
            }
        })

        // Fetch music groups
        const groups = await fastify.prisma.musicGroup.findMany({
            where: {
                id: {
                    in: m.groups
                }
            }
        })

        // Fetch categories
        const categories = await fastify.prisma.category.findMany({
            where: {
                id: {
                    in: m.categories
                }
            }
        })
        console.log(categories, m)


        return {
            ...m,
            tickets,
            groups,
            categories,
        }
    }

    return {
        ...m,
        withPopulatedFields
    }
}