import { FastifyInstance } from "fastify";
import { ConcertModel } from "generated/prisma/models";

export type ConcertModelWrapper = ReturnType<typeof concertModelWrapper>

export const concertModelWrapper = (fastify: FastifyInstance, m: ConcertModel) => {
    return {
        ...m
    }
}