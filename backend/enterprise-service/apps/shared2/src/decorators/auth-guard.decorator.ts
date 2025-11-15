import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { UserWhereInput } from "../generated/prisma/models"
import { AuthGuard } from "../guards/auth.guard"

export const AuthGuardDecorator = (params: UserWhereInput) => {
  return applyDecorators(
    UseGuards(AuthGuard),
    SetMetadata('authGuardParams', params)
  )
}