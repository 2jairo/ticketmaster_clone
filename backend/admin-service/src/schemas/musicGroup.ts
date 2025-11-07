import { FastifyInstance } from "fastify";
import { MusicGroupModel } from "generated/prisma/models";

export type MusicGroupWrapper = ReturnType<typeof musicGroupWrapper>

export const musicGroupWrapper = (fastify: FastifyInstance, m: MusicGroupModel) => {
    return {
        ...m,
    }
}