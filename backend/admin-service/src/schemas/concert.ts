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
            },
            select: {
                id: true,
                slug: true,
                title: true,
                image: true,
                followers: true,
                status: true,
                isActive: true
            }
        })

        // Fetch categories
        const categories = await fastify.prisma.category.findMany({
            where: {
                id: {
                    in: m.categoroies
                }
            },
            select: {
                id: true,
                slug: true,
                title: true,
                images: true,
                status: true,
                isActive: true
            }
        })

        // Fetch comments
        const comments = await fastify.prisma.comment.findMany({
            where: {
                id: {
                    in: m.comments
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        image: true
                    }
                }
            }
        })

        return {
            ...m,
            tickets,
            groupsData: groups,
            categoriesData: categories,
            commentsData: comments
        }
    }

    return {
        ...m,
        withPopulatedFields
    }
}