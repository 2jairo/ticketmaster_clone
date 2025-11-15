import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator((_, ctx) => {
  const req = ctx.switchToHttp().getRequest<Request>()
  return req.user
})