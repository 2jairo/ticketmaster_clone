import fp from 'fastify-plugin'
import { RouteCommonOptions } from 'types/routesCommon'
import { FastifyReply, FastifyRequest } from 'fastify'
import Stripe from 'stripe'
import { ErrKind, LocalError } from 'plugins/error/error'

export const stripeRoutes = fp(async (fastify, common: RouteCommonOptions) => {
    fastify.route({
        config: {
            rawBody: true
        },
        url: '/webhook',
        method: 'POST',
        handler: webhook
    })
    async function webhook(req: FastifyRequest, reply: FastifyReply) {
        const sig = req.headers['stripe-signature']!
        const webhookSecret = process.env.STRIPE_WHSEC!
        let event: Stripe.Event

        try {
            event = fastify.stripe.webhooks.constructEvent(req.rawBody as any, sig, webhookSecret);
        } catch (err) {
            throw new LocalError(ErrKind.BadRequest, 400, (err as Error).message)
        }

        // event.type !== 'charge.succeeded' && 
        if(event.type !== 'payment_intent.succeeded') {
            return reply.status(200).send()
        }
        
        const pi = event.data.object
        const orderId = pi.metadata.orderId
        const transactionRef = pi.id

        await fastify.prisma.$transaction(async (tx) => {
            let payment = await tx.payment.findFirst({
                where: { transactionRef }
            })

            // 1.- update payment
            if(!payment) {
                payment = await tx.payment.create({
                    data: {
                        currency: pi.currency,
                        orderId,
                        totalAmmount: pi.amount,
                        method: 'stripe',
                        transactionRef,
                        status: 'COMPLETED',
                        paidAt: new Date(),
                    }
                })
            } else if(payment.status !== 'COMPLETED') {
                payment = await tx.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'COMPLETED',
                        paidAt: new Date()
                    }
                })
            } else {
                return
            }

            // 2.- check order stock
            const order = await tx.order.findFirst({
                where: { id: orderId }
            })

            if(!order) {
                throw new LocalError(ErrKind.OrderNotFound, 404)
            }

            for (const m of order.merch) {
                const merch = await tx.merch.findFirst({
                    where: { id: m.itemId }
                })
                if(!merch || merch.stock < m.quantity) {
                    await tx.order.update({
                        where: { id: order.id },
                        data: {
                            status: 'FAILED'
                        }
                    })
                    throw new LocalError(ErrKind.NotEnoughStock, 500)
                }

                await tx.merch.update({
                    where: { id: merch.id },
                    data: {
                        stock: {
                            decrement: m.quantity
                        },
                        sold: {
                            increment: m.quantity
                        }
                    }
                })
                
                //TODO: generate sells
            }

            const ticketsSummary: { [concertId: string]: number } = {}
            for (const t of order.tickets) {
                const ticket = await tx.concertTickets.findFirst({
                    where: { id: t.itemId }
                })
                if(!ticket || ticket.available < t.quantity) {
                    await tx.order.update({
                        where: { id: order.id },
                        data: {
                            status: 'FAILED'
                        }
                    })
                    throw new LocalError(ErrKind.NotEnoughStock, 500)
                }

                await tx.concertTickets.update({
                    where: { id: ticket.id },
                    data: {
                        available: {
                            decrement: t.quantity
                        },
                        sold: {
                            increment: t.quantity
                        }
                    }
                })

                await tx.ticketSerial.createMany({
                    data: Array.from({ length: t.quantity }, () => {
                        return {
                            status: 'ACTIVE',
                            ticketId: ticket.id,
                            userId: order.userId,
                        }
                    }) 
                })

                if(!ticketsSummary[ticket.concertId]) ticketsSummary[ticket.concertId] = 0
                ticketsSummary[ticket.concertId] += t.quantity
            }

            // 3.- update concert totalTicketsSold
            for (const [concertId, quantity] of Object.entries(ticketsSummary)) {
                await tx.concert.update({
                    where: {
                        id: concertId
                    },
                    data: {
                        totalTicketsSold: {
                            increment: quantity
                        }
                    }
                })
            }

            // 4.- mark as paid
            await tx.order.update({
                where: { id: order.id },
                data: {
                    status: 'PAID',
                    updatedAt: new Date()
                }
            })
        })

        reply.status(200).send()
    }


    fastify.route({
        url: `${common.prefix}/create-payment-intent`,
        method: 'POST',
        onRequest: [fastify.authenticate({})],
        handler: createPaymentIntent
    })
    async function createPaymentIntent(req: FastifyRequest, reply: FastifyReply) {
        const cart = await fastify.prismaW.shoppingCart.findFirst({
            where: { 
                userId: req.user.userId,
                isActive: true
            }
        })

        if(!cart) {
            throw new LocalError(ErrKind.CartNotFound, 404)
        }
        const populated = await cart.withPopulatedFields()
        const total = 
            populated.tickets.reduce((acc, t) => acc + (t.price * t.quantity), 0) + 
            populated.merch.reduce((acc, t) => acc + (t.price * t.quantity), 0)

        const tx = await fastify.prisma.$transaction(async (tx) => {
            await tx.shoppingCart.update({
                where: { id: populated.id },
                data: {
                    isActive: false
                }
            })

            const order = await tx.order.create({
                data: {
                    totalAmmount: total,
                    tickets: cart.tickets,
                    merch: cart.merch,
                    userId: req.user.userId
                }
            })

            const paymentIntent = await fastify.stripe.paymentIntents.create({
                amount: total,
                currency: 'eur',
                metadata: { orderId: order.id }
            }, {
                idempotencyKey: order.id
            })

            const payment = await tx.payment.create({
                data: {
                    currency: 'eur',
                    method: 'stripe',
                    totalAmmount: total,
                    orderId: order.id,
                    transactionRef: paymentIntent.id
                }
            })

            return { payment, paymentIntent, order }
        })

        reply.status(200).send({ clientSecret: tx.paymentIntent.client_secret })
    }
})