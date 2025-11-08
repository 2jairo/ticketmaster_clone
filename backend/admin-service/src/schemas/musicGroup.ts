import { FastifyInstance } from "fastify";
import { MusicGroupStatus } from "generated/prisma/enums";
import { MusicGroupModel } from "generated/prisma/models";

export const MUSIC_GROUP_STATUS: MusicGroupStatus[] = ['ACCEPTED', 'REJECTED', 'PENDING']

export type MusicGroupWrapper = ReturnType<typeof musicGroupWrapper>

export const musicGroupWrapper = (fastify: FastifyInstance, m: MusicGroupModel) => {
    const withConcertsLength = async () => {
        const concerts = await fastify.prisma.concert.count({
            where: {
                groups: {
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
        withConcertsLength,
    }
}