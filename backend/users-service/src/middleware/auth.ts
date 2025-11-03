import type { NextFunction, Request, Response } from 'express';
import { ErrKind, LocalError } from '../error/err';
import { authenticateAccessToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      userId: string
      v: number
      logged: boolean
      role: string
    }
  }
}

const verifyJWTInner = async (req: Request, res: Response, next: NextFunction, optional: boolean) => {
  const authHeader = (req.headers.authorization || req.headers.Authorization)?.toString()

  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    if(optional) {
      req.logged = false
      return next()
    }
    throw new LocalError(ErrKind.Unauthorized, 401)
  }

  const accessToken = authHeader.split(' ')[1]!
  const claims = await authenticateAccessToken(accessToken)

  req.logged = true
  req.v = claims.v
  req.userId = claims.userId
  next()
}

export const verifyJWTOptional = (req: Request, res: Response, next: NextFunction) => {
  return verifyJWTInner(req, res, next, true)
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  return verifyJWTInner(req, res, next, false)
}