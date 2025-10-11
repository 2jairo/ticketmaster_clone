import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'

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
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const token = authHeader.split(' ')[1]!

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (err, decoded) => {
      if (err) {
        res.status(403).json({ message: 'Forbidden', error: err })
        return
      }

      req.userId = (decoded as { userId: string }).userId
      next();
    }
  )
}