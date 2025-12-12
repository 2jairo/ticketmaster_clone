import { FastifyInstance } from "fastify";
import { ConcertModel } from "generated/prisma/models";
import { ConcertStatus } from "generated/prisma/enums";

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

    const getEmbeddings = async () => {
        const input = `
            TITLE: ${m.title},
            description: ${m.description},
            location: ${m.locationName}
        `

        const resp = await fastify.axios.lmStudio.post<getEmbeddingsResponse>('/v1/embeddings', {
			model: process.env.LMSTUDIO_EMBEDDING_MODEL!,
			input
		})
        return resp.data.data[0].embedding
    }



    return {
        ...m,
        withPopulatedFields,
        getEmbeddings
    }
}