import fp from 'fastify-plugin'
import { RouteCommonOptions } from 'types/routesCommon'
import { dashboardMusicGroupsSchemas, createGroupBody, updateGroupBody } from './schema'
import { ADMIN_ROOT } from 'schemas/user'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Pagination } from 'types/pagination'

export const dashboardMusicGroupsRoutes = fp((fastify, options: RouteCommonOptions) => {
    fastify.route({
        method: 'GET',
        url: `${options.prefix}`,
        schema: dashboardMusicGroupsSchemas.groupList,
        onRequest: [fastify.authenticate(ADMIN_ROOT)],
        handler: getMusicGroupList
    })
    async function getMusicGroupList(req: FastifyRequest<{ Querystring: Pagination }>, reply: FastifyReply) {
        const groups = await fastify.prismaW.musicGroup.findMany({
            skip: req.query.offset,
            take: req.query.size
        })

        const resp = await Promise.all(
            groups.map(g => g.withConcertsLength())
        )
        reply.status(200).send(resp)
    }

    fastify.route({
        method: 'POST',
        url: `${options.prefix}`,
        schema: dashboardMusicGroupsSchemas.createGroup,
        onRequest: [fastify.authenticate(ADMIN_ROOT)],
        handler: createMusicGroup
    })
    async function createMusicGroup(
        req: FastifyRequest<{ Body: createGroupBody }>,
        reply: FastifyReply
    ) {
        const group = await fastify.prismaW.musicGroup.create({ 
            data: req.body 
        })
        
        reply.status(201).send({ ...group, concerts: 0 })
    }

    fastify.route({
        method: 'POST',
        url: `${options.prefix}/:slug`,
        schema: dashboardMusicGroupsSchemas.updateGroup,
        onRequest: [fastify.authenticate(ADMIN_ROOT)],
        handler: updateMusicGroup
    })
    async function updateMusicGroup(
        req: FastifyRequest<{ Params: { slug: string }, Body: updateGroupBody }>,
        reply: FastifyReply
    ) {
        const { slug } = req.params
        const group = await fastify.prismaW.musicGroup.update({ 
            where: { slug }, 
            data: req.body 
        })

        reply.status(200).send(await group.withConcertsLength())
    }

    fastify.route({
        method: 'DELETE',
        url: `${options.prefix}/:slug`,
        onRequest: [fastify.authenticate(ADMIN_ROOT)],
        handler: deleteMusicGroup
    })
    async function deleteMusicGroup(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
        const { slug } = req.params

        await fastify.prismaW.musicGroup.delete({
            where: { slug } 
        })
        reply.status(204).send()
    }
})