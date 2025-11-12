import fp from 'fastify-plugin'
import { RouteCommonOptions } from 'types/routesCommon'

export const dashboardConcertRotues = fp((fastify, options: RouteCommonOptions) => {
	// fastify.route({
	// 	method: 'GET',
	// 	url: `${options.prefix}`,
	// 	onRequest: [fastify.authenticate(ADMIN_ROOT)],
	// 	handler: getConcertList
	// })
	// async function getConcertList(req: FastifyRequest<{ Querystring: Pagination }>, reply: FastifyReply) {
	// 	const concerts = await fastify.prismaW.concert.findMany({
	// 		skip: req.query.offset,
	// 		take: req.query.size
	// 	})

	// 	reply.status(200).send(concerts)
	// }
})