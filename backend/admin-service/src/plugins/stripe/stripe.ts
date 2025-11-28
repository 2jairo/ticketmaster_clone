import fp from 'fastify-plugin'
import fastifyRawBody from 'fastify-raw-body'
import Stripe from 'stripe'

declare module "fastify" {
    interface FastifyInstance {
        stripe: Stripe
    }
}

export const stripePlugin = fp(async (fastify) => {
    await fastify.register(fastifyRawBody) // for webhook

    const stripe = new Stripe(process.env.STRIPE_SK!) // STRIPE SECRET KEY
    fastify.decorate('stripe', stripe)
})