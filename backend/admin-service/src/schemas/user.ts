import { FastifyInstance } from "fastify";
import { UserRole } from "generated/prisma/enums";
import { UserModel, UserWhereInput } from "generated/prisma/models";
import { JwtClaims } from "plugins/jwt/jwt";

export const USER_ROLES: UserRole[] = ['ADMIN', 'CLIENT', 'ROOT']
export const ADMIN_ROOT_ACTIVE: UserWhereInput = {
    role: {
        in: ['ADMIN', 'ROOT']
    },
    isActive: true
}

export type UserModelWrapper = ReturnType<typeof userModelWrapper>

export const userModelWrapper = (fastify: FastifyInstance, m: UserModel) => {
    const getJwtClaims = (): JwtClaims => {
        return {
            userId: m.id,
            v: m.v,
            role: m.role
        }
    }

    const toUserResponse = (token?: string) => {
        return {
            username: m.username,
            email: m.email,
            image: m.image,
            role: m.role,
            ...(token ? { token } : {})
        }
    }

    // const toIsActiveResponse = () => {
    //     return {
    //         username: m.username,
    //         email: m.email,
    //         image: m.image,
    //         role: m.role,
    //         isActive: m.isActive,
    //     }
    // }

    const toRootResponse = async () => {
        const groups = await fastify.prismaW.musicGroup.findMany({
            where: { 
                id: { in: m.followingGroups },
                isActive: true
            }
        })
        const following = await fastify.prismaW.user.findMany({
            where: {
                id: { in: m.followingUsers },
                isActive: true
            }
        })

        const followingUsers = following.map(f => f.toUserResponse()) as ReturnType<typeof toUserResponse>[]

        return {
            username: m.username,
            email: m.email,
            image: m.image,
            role: m.role,
            isActive: m.isActive,
            followers: m.followers,
            followingGroups: groups.map(g => g.toProfileResponse()),
            followingUsers
        }
    }

    return {
        ...m,
        toUserResponse,
        getJwtClaims,
        toRootResponse
    }
}