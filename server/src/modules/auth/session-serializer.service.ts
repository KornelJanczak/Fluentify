import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { type User } from 'src/shared/db/db.schema';
import { type VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class SessionSerializerService extends PassportSerializer {
  private readonly logger = new Logger(SessionSerializerService.name);

  constructor(private readonly authService: AuthService) {
    super();
  }

  public serializeUser({ id }: User, done: VerifyCallback) {
    this.logger.log(`User has been serialized: ${id}`);
    done(null, id);
  }

  public async deserializeUser(id: string, done: VerifyCallback) {
    const currentUser = await this.authService.getUserById(id);
    this.logger.log(`User has been deserialized: ${currentUser.email}`);
    return currentUser ? done(null, currentUser) : done(null, null);
  }
}
