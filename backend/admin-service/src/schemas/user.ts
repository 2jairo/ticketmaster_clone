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

    const withToken = (token: string) => {
        return {
            ...m,
            token
        }
    }

    const populateFollowing = async () => {
        const groups = await fastify.prisma.musicGroup.findMany({
            where: { 
                id: { in: m.followingGroups },
                isActive: true
            }
        })
        const following = await fastify.prisma.user.findMany({
            where: {
                id: { in: m.followingUsers },
                isActive: true
            }
        })

        return {
            ...m,
            followingGroups: groups,
            followingUsers: following
        }
    }

    return {
        ...m,
        withToken,
        getJwtClaims,
        populateFollowing
    }
}