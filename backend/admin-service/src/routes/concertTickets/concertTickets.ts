import fp from 'fastify-plugin'
import { RouteCommonOptions } from 'types/routesCommon'
import { dashboardConcertTicketsSchemas, createConcertTicketBody, updateConcertTicketBody } from './schema'
import { ADMIN_ROOT } from 'schemas/user'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Pagination } from 'types/pagination'
import { ConcertTicketsUncheckedUpdateInput } from 'generated/prisma/models'

export const dashboardConcertTicketsRoutes = fp((fastify, options: RouteCommonOptions) => {
    // GET all concert tickets (with pagination)
    fastify.route({
        method: 'GET',
        url: `${options.prefix}`,
        schema: dashboardConcertTicketsSchemas.concertTicketList,
        onRequest: [fastify.authenticate(ADMIN_ROOT)],
        handler: getConcertTicketList
    })
    async function getConcertTicketList(req: FastifyRequest<{ Querystring: Pagination }>, reply: FastifyReply) {
        const tickets = await fastify.prisma.concertTickets.findMany({
            skip: req.query.offset,
            take: req.query.size,
            include: {
                concert: {
                    select: { 
                        slug: true,
                        title: true,
                    }
                }
            }
        })

        const response = tickets.map(ticket => ({
            ...ticket,
            concertSlug: ticket.concert.slug,
            concertTitle: ticket.concert.title
        }))

        reply.status(200).send(response)
    }

    // GET concert tickets by concert slug
    fastify.route({
        method: 'GET',
        url: `${options.prefix}/concert/:slug`,
        schema: dashboardConcertTicketsSchemas.concertTicketsByConcert,
        onRequest: [fastify.authenticate(ADMIN_ROOT)],
        handler: getConcertTicketsByConcert
    })
    async function getConcertTicketsByConcert(
        req: FastifyRequest<{ Params: { slug: string } }>, 
        reply: FastifyReply
    ) {
        const { slug } = req.params
        const concert = await fastify.prisma.concert.findUniqueOrThrow({
            where: { slug }
        })
        
        const tickets = await fastify.prisma.concertTickets.findMany({
            where: { concertId: concert.id },
            include: {
                concert: {
                    select: {
                        slug: true,
                        title: true
                    }
                }
            }
        })

        const response = tickets.map(ticket => ({
            ...ticket,
            concertSlug: ticket.concert.slug,
            concertTitle: ticket.concert.title            
        }))

        reply.status(200).send(response)
    }

    // GET single concert ticket by ID
    fastify.route({
        method: 'GET',
        url: `${options.prefix}/:id`,
        schema: dashboardConcertTicketsSchemas.getConcertTicket,
        onRequest: [fastify.authenticate(ADMIN_ROOT)],
        handler: getConcertTicket
    })
    async function getConcertTicket(
        req: FastifyRequest<{ Params: { id: string } }>, 
        reply: FastifyReply
    ) {
        const { id } = req.params
        const ticket = await fastify.prisma.concertTickets.findUniqueOrThrow({
            where: { id },
            include: {
                concert: {
                    select: { 
                        slug: true,
                        title: true
                    }
                }
            }
        })

        reply.status(200).send({
            ...ticket,
            concertSlug: ticket.concert.slug,
            concertTitle: ticket.concert.title,
        })
    }

    // POST create concert ticket
    fastify.route({
        method: 'POST',
        url: `${options.prefix}`,
        schema: dashboardConcertTicketsSchemas.createConcertTicket,
        onRequest: [fastify.authenticate(ADMIN_ROOT)],
        handler: createConcertTicket
    })
    async function createConcertTicket(
        req: FastifyRequest<{ Body: createConcertTicketBody }>,
        reply: FastifyReply
    ) {
        const { concertSlug, ...ticketData } = req.body
        
        const concert = await fastify.prisma.concert.findUniqueOrThrow({
            where: { slug: concertSlug }
        })
        
        const ticket = await fastify.prisma.concertTickets.create({ 
            data: {
                ...ticketData,
                concertId: concert.id
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
        
        reply.status(201).send({
            ...ticket,
            concertSlug: ticket.concert.slug,
            concertTitle: ticket.concert.title,
        })
    }

    // PUT/PATCH update concert ticket
    fastify.route({
        method: 'PUT',
        url: `${options.prefix}/:id`,
        schema: dashboardConcertTicketsSchemas.updateConcertTicket,
        onRequest: [fastify.authenticate(ADMIN_ROOT)],
        handler: updateConcertTicket
    })
    async function updateConcertTicket(
        req: FastifyRequest<{ Params: { id: string }, Body: updateConcertTicketBody }>,
        reply: FastifyReply
    ) {
        const { id } = req.params
        const { concertSlug, ...ticketData } = req.body
        
        let updateData: ConcertTicketsUncheckedUpdateInput = ticketData
        
        if (concertSlug) {
            const concert = await fastify.prisma.concert.findUniqueOrThrow({
                where: { slug: concertSlug }
            })
            updateData = { ...ticketData, concertId: concert.id }
        }
        
        const ticket = await fastify.prisma.concertTickets.update({ 
            where: { id }, 
            data: updateData,
            include: {
                concert: {
                    select: { 
                        slug: true,
                        title: true
                    }
                }
            }
        })

        reply.status(200).send({
            ...ticket,
            concertSlug: ticket.concert.slug,
            concertTitle: ticket.concert.title,
        })
    }

    // DELETE concert ticket
    fastify.route({
        method: 'DELETE',
        url: `${options.prefix}/:id`,
        schema: dashboardConcertTicketsSchemas.deleteConcertTicket,
        onRequest: [fastify.authenticate(ADMIN_ROOT)],
        handler: deleteConcertTicket
    })
    async function deleteConcertTicket(
        req: FastifyRequest<{ Params: { id: string } }>, 
        reply: FastifyReply
    ) {
        const { id } = req.params

        await fastify.prisma.concertTickets.delete({
            where: { id } 
        })
        reply.status(204).send()
    }
})
