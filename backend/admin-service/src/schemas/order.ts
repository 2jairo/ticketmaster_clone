import { FastifyInstance } from "fastify"
import { OrderModel } from "generated/prisma/models"
import { OrderStatus } from "generated/prisma/enums"

export const ORDER_STATUS: OrderStatus[] = ['CANCELED', 'FAILED', 'PAID', 'PENDING']

export type OrderWrapper = ReturnType<typeof orderWrapper>

export const orderWrapper = (fastify: FastifyInstance, m: OrderModel) => {
    const withPopulatedFields = async () => {
        const tickets = await fastify.prisma.concertTickets.findMany({
            where: { 
                id: { in: m.tickets.map((t) => t.itemId) }
            },
            include: {
                concert: {
                    select: { 
                        slug: true,
                        title: true
                    }
                }
            }
        })
        const merch = await fastify.prisma.merch.findMany({
            where: {
                id: { in: m.merch.map((m) => m.itemId) }
            },
        })

        const ticketQuantityMap = m.tickets.reduce((acc, value) => {
            acc[value.itemId] = value.quantity
            return acc
        }, {} as { [s:string]: number })
        
        const merchQuantityMap = m.merch.reduce((acc, value) => {
            acc[value.itemId] = value.quantity
            return acc
        }, {} as { [s:string]: number })

        return {
            ...m,
            tickets: tickets.map((t) => ({ 
                ...t,
                concertSlug: t.concert.slug,
                concertTitle: t.concert.title,
                quantity: ticketQuantityMap[t.id] 
            })),
            merch: merch.map((m) => ({ ...m, quantity: merchQuantityMap[m.id] }))
        }
    }

    return {
        ...m,
        withPopulatedFields,
    }
}
