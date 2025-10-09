import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      userEmail?: string
      userHashedPwd?: string
    }
  }
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = (req.headers.authorization || req.headers.Authorization)?.toString()

    if (!authHeader || !authHeader?.startsWith('Token ')) {
        res.status(401).json({ message: 'Unauthorized' })
        return
    }

    const token = authHeader.split(' ')[1]!

    jwt.verify(
        token,
        process.env.JWT_SECRET!,
        (err, decoded) => {
            if (err || !decoded || typeof decoded !== 'object' || !('user' in decoded) || !decoded.user) {
                res.status(403).json({ message: 'Forbidden' })
                return
            }

            req.userId = decoded.user.id;
            req.userEmail = decoded.user.email;
            req.userHashedPwd = decoded.user.password;
            next();
        }
    )
};