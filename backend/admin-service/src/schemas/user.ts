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

export const userModelWrapper = (m: UserModel) => {
    const getJwtClaims = (): JwtClaims => {
        return {
            userId: m.id,
            v: m.v,
            role: m.role
        }
    }

    const toUserResponse = (token?: string) => {
        console.log(m)
        return {
            username: m.username,
            email: m.email,
            image: m.image,
            role: m.role,
            ...(token ? { token } : {})
        }
    }

    return {
        ...m,
        toUserResponse,
        getJwtClaims
    }
}