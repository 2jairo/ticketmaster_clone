import { FastifyInstance } from "fastify"
import { ShoppingCartModel } from "generated/prisma/models"

export type ShoppingCartModelWrapper = ReturnType<typeof shoppingCartModelWrapper>

export const shoppingCartModelWrapper = (fastify: FastifyInstance, m: ShoppingCartModel) => {
    const withPopulatedFields = async () => {
        const tickets = await fastify.prisma.concertTickets.findMany({
            where: { 
                id: { in: m.tickets.map((t) => t.itemId) }
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
            tickets: tickets.map((t) => ({ ...t, quantity: ticketQuantityMap[t.id] })),
            merch: merch.map((m) => ({ ...m, quantity: merchQuantityMap[m.id] }))
        }
    }

    return {
        ...m,
        withPopulatedFields
    }
}