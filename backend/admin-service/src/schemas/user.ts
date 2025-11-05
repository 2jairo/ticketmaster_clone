import { UserRole } from "generated/prisma/enums";
import { UserModel } from "generated/prisma/models";
import { JwtClaims } from "plugins/jwt/jwt";

export const ADMIN_ACTIVE: { role: UserRole, isActive: true } = { role: 'ADMIN', isActive: true }

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