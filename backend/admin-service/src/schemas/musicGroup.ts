import fastify, { FastifyInstance } from "fastify";
import { MusicGroupModel } from "generated/prisma/models";

export type MusicGroupWrapper = ReturnType<typeof musicGroupWrapper>

export const musicGroupWrapper = (fastify: FastifyInstance, m: MusicGroupModel) => {


    const toProfileResponse = () => {
        return {
            slug: m.slug,
            image: m.image,
            followers: m.followers,
            title: m.title,
            description: m.description,
        }
    }


    return {
        ...m,
        toProfileResponse,
    }
}