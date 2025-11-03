import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

export const swaggerPlugin = fp(async (fastify) => {
    await fastify.register(swagger, {
        openapi: {
            info: {
                title: 'API de Ejemplo con Fastify y Fluent JSON Schema',
                description: 'Ejemplo de validación y documentación automática',
                version: '1.0.0'
            },
        }
    })

    await fastify.register(swaggerUi, {
        routePrefix: '/docs',
        staticCSP: true
    })
})