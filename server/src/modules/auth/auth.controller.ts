import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Req,
  UseGuards,
  Redirect,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserType } from 'src/shared/db/db.schema';
import { Request } from 'express';
import { GoogleAuthGuard } from './strategies/google.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  abc = 123;

  constructor(private readonly configService: ConfigService) {}

  @Get('logout')
  public logOut(@Req() req: Request) {
    req.logout((error) => {
      if (error) {
        throw new HttpException(
          'User is not authorized to this action',
          HttpStatus.UNAUTHORIZED,
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
      throw new HttpException(
        'User is not authorized to this action',
        HttpStatus.UNAUTHORIZED,
      );

    this.logger.log(`User is authenticated ${user.id}`);

    return user;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  public handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('callback/google')
  @UseGuards(GoogleAuthGuard)
  @Redirect(`http://localhost:3000`, 301)
  public googleCallback() {
    return { msg: 'Google callback' };
  }
}
