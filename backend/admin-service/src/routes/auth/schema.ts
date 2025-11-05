import { FastifySchema } from 'fastify'
import S from 'fluent-json-schema'


const userResponse = S.object()
    .prop('username', S.string().required().maxLength(50))
    .prop('email', S.string().required().maxLength(100))
    .prop('image', S.string().required())
    .prop('token', S.string().required())


export interface loginRequestBody { 
    credential: string
    password: string
}
const login: FastifySchema = {
    body: S.object()
        .id('api/auth/login')
        .title('admin user Login')
        .description('Login admin user and respond with token')
        .prop('credential', S.string().required().maxLength(100))
        .prop('password', S.string().required().maxLength(100)),
    response: {
        200: userResponse,
    }
}

export interface registerRequestBody {
    username: string
    email: string
    password: string
}
const register: FastifySchema = {
    body: S.object()
        .id('api/auth/register')
        .title('admin user Signin')
        .description('Signin admin user and respond with token')
        .prop('username', S.string().required().maxLength(50))
        .prop('email', S.string().required().format('email').maxLength(100))
        .prop('password', S.string().required().maxLength(100)),

    response: {
        200: userResponse,
    }
}

const user: FastifySchema = {

}

export const authSchema = { login, register, user }
