import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { type User as UserType } from 'src/shared/db/db.schema';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user: UserType = request.user as UserType;
    return user;
  },
);
