import {
  Controller,
  Get,
  Logger,
  Req,
  UseGuards,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserType } from 'src/shared/db/db.schema';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './strategies/google.guard';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { ConfigService } from '@nestjs/config';

@UseGuards(GoogleAuthGuard)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly configService: ConfigService) {}

  @Get('logout')
  public logOut(@Req() req: Request) {
    req.logout((error) => {
      if (error) {
        throw new UnauthorizedException(
          'User is not authorized to this action',
        );
      } else {
        this.logger.log(`User has been logged out`);

        return 'Logged out successfully';
      }
    });
  }

  @Get('session')
  public authSession(@User() user: UserType) {
    if (!user)
      throw new UnauthorizedException('User is not authorized to this action');

    this.logger.log(`User is authenticated ${user.id}`);

    return user;
  }

  @Get('google')
  public handleLogin(@Req() req: Request) {
    this.logger.log('Handle login with Google');
  }

  @Get('/callback/google')
  public googleCallback(@UserId() id: string, @Res() res: Response) {
    this.logger.log(`User[${id}] handle Google callback`);

    res.redirect(this.configService.get<string>(`CLIENT_URL`) + '/dashboard');
  }
}
