import { FastifySchema } from "fastify"
import S from "fluent-json-schema"
import { UserRole } from "generated/prisma/enums"
import { USER_ROLES } from "schemas/user"
import { paginationSchema } from "types/pagination"

const userResponse = S.object()
    .prop("username", S.string())
    .prop("email", S.string())
    .prop("role", S.enum(USER_ROLES))
    .prop("image", S.string())
    .prop("followers", S.number())
    .prop("followingGroupsLength", S.number())
    .prop("followingUsersLength", S.number())
    .prop("isActive", S.boolean())

export const USERS_PER_PAGE = 10

const userList: FastifySchema = {
    querystring: paginationSchema(USERS_PER_PAGE),
    response: {
        200: S.array().items(userResponse)
    }
}


export interface updateUserBody {
  username?: string;
  email?: string;
  image?: string;
  password?: string
  role?: UserRole;
  isActive?: boolean;
}

const updateUser: FastifySchema = {
    body: S.object()
        .prop("username", S.string())
        .prop("email", S.string().format("email"))
        .prop("image", S.string())
        .prop("password", S.string())
        .prop("role", S.enum(USER_ROLES))
        .prop("isActive", S.boolean())
        .minProperties(1),
 
    response: {
        200: userResponse
    }
}

export const dashboardUserSchemas = { userList, updateUser }
