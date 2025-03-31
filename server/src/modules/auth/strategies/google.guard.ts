import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }

  public async canActivate(context: ExecutionContext) {
    console.log('GoogleAuthGuard canActivate called');

    const request = context.switchToHttp().getRequest<Request>();

    console.log('request', request.isAuthenticated());

    if (request.isAuthenticated()) return true;

    const activate = (await super.canActivate(context)) as boolean;
    await super.logIn(request);

    console.log('activate without google', activate);

    return activate;
  }
}
