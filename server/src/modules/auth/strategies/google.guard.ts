import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }

  public async canActivate(context: ExecutionContext) {
    console.log('GoogleAuthGuard canActivate called');

    const request = context.switchToHttp().getRequest<Request>();

    if (request.isAuthenticated()) return true;

    const activate = (await super.canActivate(context)) as boolean;
    await super.logIn(request);

    return activate;
  }
}
