import { AdminModel } from "generated/prisma/models";
import { JwtClaims } from "plugins/jwt/jwt";

export type AdminModelWrapper = ReturnType<typeof adminModelWrapper>

export const adminModelWrapper = (m: AdminModel) => {
    const getJwtClaims = (): JwtClaims => {
        return {
            userId: m.id,
            v: m.v,
            role: 'admin'
        }
    }

    const toProfileResponse = (token?: string) => {
        return {
            username: m.username,
            email: m.email,
            image: m.image,
            ...(token ? { token } : {})
        }
    }

    return {
        ...m,
        toProfileResponse,
        getJwtClaims
    }
}