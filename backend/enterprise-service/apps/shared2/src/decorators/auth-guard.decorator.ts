import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { UserWhereInput } from "../generated/prisma/models"
import { AuthGuard } from "../guards/auth.guard"

export const ROOT_ENTERPRISE: UserWhereInput = {
  role: {
    in: ['ENTERPRISE', 'ROOT']
  }
}

export const AuthGuardDecorator = (params?: UserWhereInput) => {
  return applyDecorators(
    UseGuards(AuthGuard),
    SetMetadata('authGuardParams', params || ROOT_ENTERPRISE)
  )
}