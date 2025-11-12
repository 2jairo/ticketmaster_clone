import jwt from 'jsonwebtoken'
import type { Response } from 'express';
import { ErrKind, LocalError } from '../error/err';

export type UserRole = 'ADMIN' | 'CLIENT' | 'ROOT' | 'ENTERPRISE'
export const USER_ROLES: UserRole[] = ['ADMIN', 'CLIENT', 'ROOT', 'ENTERPRISE']

export type AccesTokenClaims = {
    userId: string,
    v: number,
    role: UserRole
}
export const REFRESH_TOKEN_COOKIE = 'jid'

export const generateAccesToken = (claims: AccesTokenClaims) => {
    //@ts-ignore
    return jwt.sign(
        claims,
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: `${process.env.JWT_ACCESS_EXPIRES_IN_HOURS!}h` }
    ) as string
}

export const generateRefreshTokenCookie = (claims: AccesTokenClaims, res: Response) => {
    //@ts-ignore
    const token = jwt.sign(
        claims,
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: `${process.env.JWT_REFRESH_EXPIRES_IN_DAYS!}d` }
    ) as string

    res.cookie(REFRESH_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_DAYS!) * 24 * 60 * 60 * 1000,
    })
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

export const authenticateRefreshToken = async (refreshToken: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!,
            (err, decoded) => {
                if (err) {
                    reject(new LocalError(ErrKind.ExpiredRefreshToken, 401))
                }
                else {
                    const d = decoded as AccesTokenClaims
                    resolve({
                        userId: d.userId,
                        v: d.v,
                        role: d.role,
                    })
                }
            }
        )
    }) as Promise<AccesTokenClaims>
}