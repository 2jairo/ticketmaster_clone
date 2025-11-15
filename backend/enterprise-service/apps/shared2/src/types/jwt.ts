import { UserRole } from "../generated/prisma/enums";

export interface JwtClaims {
  userId: string,
  v: number,
  role: UserRole
}

declare module "express" {
  interface Request {
    user: JwtClaims
  }
}