import { FastifyInstance } from "fastify";
import { UserRole } from "generated/prisma/enums";
import { UserModel, UserWhereInput } from "generated/prisma/models";
import { JwtClaims } from "plugins/jwt/jwt";

export const USER_ROLES: UserRole[] = ['ADMIN', 'CLIENT', 'ROOT', 'ENTERPRISE']
export const ADMIN_ROOT: UserWhereInput = {
    role: {
        in: ['ADMIN', 'ROOT']
    }
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

    const populateFollowing = async (limit: number) => {
        const groups = limit === 0
            ? []
            : await fastify.prisma.musicGroup.findMany({
                where: {
                    id: { in: m.followingGroups.slice(0, limit) },
                    isActive: true
                }
            })

        const following = limit === 0
            ? []
            : await fastify.prisma.user.findMany({
                where: {
                    id: { in: m.followingUsers.slice(0, limit) },
                    isActive: true
                }
            })

        return {
            ...m,
            followingGroups: groups,
            followingGroupsLength: m.followingGroups.length,
            followingUsers: following,
            followingUsersLength: m.followingUsers.length,
        }
    }

    return {
        ...m,
        withToken,
        getJwtClaims,
        populateFollowing
    }
}