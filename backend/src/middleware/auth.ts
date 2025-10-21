import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { ErrKind, LocalError } from '../error/err';

declare global {
  namespace Express {
    interface Request {
      userId: string
      v: number
      logged: boolean
    }
  }
}

const verifyJWTInner = (req: Request, res: Response, next: NextFunction, optional: boolean) => {
  const authHeader = (req.headers.authorization || req.headers.Authorization)?.toString()

  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    if(optional) {
      req.logged = false
      return next()
    }
    throw new LocalError(ErrKind.Unauthorized, 401)
  }

  const token = authHeader.split(' ')[1]!

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (err, decoded) => {
      if (err) {
        if(optional) {
          req.logged = false
          return next()
        }
        throw new LocalError(ErrKind.Unauthorized, 401)
      }
      else {
        const d = decoded as { userId: string, v: number }
        req.logged = true
        req.v = d.v
        req.userId = d.userId
        next()
      }
    }
  )
}

export const verifyJWTOptional = (req: Request, res: Response, next: NextFunction) => {
  return verifyJWTInner(req, res, next, true)
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  return verifyJWTInner(req, res, next, false)
}