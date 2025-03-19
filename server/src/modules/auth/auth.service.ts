import { Injectable, UnauthorizedException } from '@nestjs/common';
import { type Profile } from 'passport-google-oauth20';
import { type User } from 'src/shared/db/db.schema';
import UserRepository from 'src/shared/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  public async validateUser(profile: Profile) {
    const { sub, email, picture } = profile._json;

    const existingUser = await this.userRepository.getByEmail(email);
    let user: User;

    if (existingUser) {
      user = existingUser;
    } else {
      const newUser: User = {
        id: sub,
        email: email,
        imagePath: picture,
        role: 'user',
        subscriptionExpiryDate: new Date().getDate().toLocaleString(),
        studyingLanguageLevel: 'B1',
        nativeLanguage: 'PL',
        tutorId: 'en-US-Casual-K',
      };

      user = await this.userRepository.create(newUser);
    }

    return user;
  }

  public async getUserById(id: string) {
    const currentUser = await this.userRepository.getById(id);

    if (!currentUser)
      throw new UnauthorizedException('User is not authorized to this action');

    return currentUser;
  }
}
