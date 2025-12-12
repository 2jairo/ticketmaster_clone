import fp from 'fastify-plugin'
import axios, { AxiosInstance } from 'axios'

declare module "fastify" {
    interface FastifyInstance {
        axios: {
            lmStudio: AxiosInstance
        }
    }
}

export const axiosPlugin = fp(async (fastify) => {
    const lmStudio = axios.create({
        baseURL: 'http://127.0.0.1:1234',
    })

    fastify.decorate('axios', {
        lmStudio
    })
})