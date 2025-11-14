import jwt from 'jsonwebtoken'
import { ErrKind, LocalError } from '../error/err';

export type UserRole = 'ADMIN' | 'CLIENT' | 'ROOT' | 'ENTERPRISE'
export const USER_ROLES: UserRole[] = ['ADMIN', 'CLIENT', 'ROOT', 'ENTERPRISE']

export type AccesTokenClaims = {
    userId: string,
    v: number,
    role: UserRole
}

export const authenticateAccessToken = async (accessToken: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET!,
            (err, decoded) => {
                if (err) {
                    reject(new LocalError(ErrKind.ExpiredAccessToken, 401))
                }
                else {
                    const d = decoded as AccesTokenClaims
                    resolve({
                        userId: d.userId,
                        v: d.v,
                        role: d.role
                    })
                }
            }
        )
    }) as Promise<AccesTokenClaims>
}