import { FastifyInstance } from "fastify";
import { ConcertModel } from "generated/prisma/models";
import { ConcertStatus } from "generated/prisma/enums";
import { PrismaClient } from "generated/prisma/client";

export const CONCERT_STATUS: ConcertStatus[] = ['ACCEPTED', 'REJECTED', 'PENDING']

export type ConcertModelWrapper = ReturnType<typeof concertModelWrapper>

interface getEmbeddingsResponse {
    object: string
    model: string
    usage: {
        prompt_tokens: number
        total_tokens: number
    }
    data: {
        object: 'embedding'
        embedding: number[]
    }[]
}

export const concertModelGetEmbeddings = async (fetchTickets = true, m: ConcertModel, findManyTickets: FastifyInstance['prisma']['concertTickets']['findMany'], fastify: FastifyInstance) => {
    let tickets = { cheapest: null, highest: null } as {
        cheapest: number | null,
        highest: number | null
    }

    if (fetchTickets) {
        tickets = await findManyTickets({
            where: {
                concertId: m.id,
            },
            select: {
                price: true
            }
        }).then((resp) => {
            if (resp.length === 0) return { cheapest: null, highest: null }
            const prices = resp.map(t => t.price)
            return {
                cheapest: Math.min(...prices),
                highest: Math.max(...prices)
            }
        })
    }

    const input = `
            TITLE: ${m.title},
            description: ${m.description},
            location: ${m.locationName},
            ticketsSold: ${m.totalTicketsSold},
            cheapest price: ${tickets.cheapest ? (tickets.cheapest / 100).toFixed(2) : 'null'},
            highest price: ${tickets.highest ? (tickets.highest / 100).toFixed(2) : 'null'}
        `

    const resp = await fastify.axios.lmStudio.post<getEmbeddingsResponse>('/v1/embeddings', {
        model: process.env.LMSTUDIO_EMBEDDING_MODEL!,
        input
    })
    return {
        embedding: resp.data.data[0].embedding,
        tickets
    }
}

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

        return {
            ...m,
            tickets,
            groups,
            categories,
        }
    }

    const getEmbeddings = async (fetchTickets = true) => {
        return concertModelGetEmbeddings(fetchTickets, m, fastify.prisma.concertTickets.findMany, fastify)
    }

    return {
        ...m,
        withPopulatedFields,
        getEmbeddings
    }
}