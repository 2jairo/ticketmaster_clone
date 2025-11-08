import { FastifyInstance } from "fastify";
import { MusicGroupStatus } from "generated/prisma/enums";
import { MusicGroupModel } from "generated/prisma/models";

export const MUSIC_GROUP_STATUS: MusicGroupStatus[] = ['ACCEPTED', 'REJECTED', 'PENDING']

export type MusicGroupWrapper = ReturnType<typeof musicGroupWrapper>

export const musicGroupWrapper = (fastify: FastifyInstance, m: MusicGroupModel) => {
    return {
        ...m,
    }
}