import { FastifySchema } from 'fastify'
import S from 'fluent-json-schema'
import { UserRole } from 'generated/prisma/enums'
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, USERNAME_MAX_LENGTH } from 'schemas/constraints'
import { USER_ROLES } from 'schemas/user'

const userResponse = S.object()
    .prop('username', S.string().required().maxLength(USERNAME_MAX_LENGTH))
    .prop('email', S.string().required().maxLength(EMAIL_MAX_LENGTH))
    .prop('image', S.string().required())
    .prop('token', S.string())
    .prop('role', S.enum(USER_ROLES).required())


export interface loginRequestBody { 
    credential: string
    password: string
}
const login: FastifySchema = {
    body: S.object()
        .id('api/auth/login')
        .title('admin user Login')
        .description('Login admin user and respond with token')
        .prop('credential', S.string().required().maxLength(EMAIL_MAX_LENGTH))
        .prop('password', S.string().required().maxLength(PASSWORD_MAX_LENGTH)),
    response: {
        200: userResponse,
    }
}

export interface registerRequestBody {
    username: string
    email: string
    password: string
    role?: UserRole
}
const register: FastifySchema = {
    body: S.object()
        .id('api/auth/register')
        .title('admin user Signin')
        .description('Signin admin user and respond with token')
        .prop('username', S.string().required().maxLength(USERNAME_MAX_LENGTH))
        .prop('email', S.string().required().format('email').maxLength(EMAIL_MAX_LENGTH))
        .prop('password', S.string().required().maxLength(PASSWORD_MAX_LENGTH))
        .prop('role', S.enum(USER_ROLES)),

    response: {
        200: userResponse,
    }
}

const user: FastifySchema = {
    response: {
        200: userResponse
    }
}


export interface updateUserPasswordRequestBody {
    new: string
    old: string
    userId?: string
}
const updateUserPassword: FastifySchema = {
    body: S.object()
        .id('/api/auth/update/password')
        .title('update user password')
        .description('update the user password')
        .prop('new', S.string().required().maxLength(PASSWORD_MAX_LENGTH))
        .prop('old', S.string().required().maxLength(PASSWORD_MAX_LENGTH))
        .prop('userId', S.string()),

    response: {
        200: userResponse
    }
}


export interface updateUserInfoRequestBody {
    username?: string
    email?: string
    image?: string
    userId?: string
}
const updateUserInfo: FastifySchema = {
    body: S.object()
        .id('/api/auth/update')
        .title('update user info')
        .description('update the user info')       
        .prop('username', S.string().maxLength(USERNAME_MAX_LENGTH))
        .prop('email', S.string().maxLength(EMAIL_MAX_LENGTH))
        .prop('image', S.string())
        .prop('userId', S.string()),

    response: {
        200: userResponse
    }
}


export const authSchema = { login, register, user, updateUserPassword, updateUserInfo }
