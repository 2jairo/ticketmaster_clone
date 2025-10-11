import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { ErrKind, LocalError } from '../error/err';

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = (req.headers.authorization || req.headers.Authorization)?.toString()

  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    throw new LocalError(ErrKind.Unauthorized, 401)
  }

  const token = authHeader.split(' ')[1]!

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (err, decoded) => {
      if (err) {
        throw new LocalError(ErrKind.Unauthorized, 401)
      }

      req.userId = (decoded as { userId: string }).userId
      next()
    }
  )
}