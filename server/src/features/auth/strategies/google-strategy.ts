import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import { User } from "../../../shared/services/db/schema";
import UserRepository from "@shared/repositories/user.repository";
import { config } from "@root/config";
import AuthenticationError from "../../../shared/errors/authentication.error";

const userRepository = new UserRepository();
const logger = config.createLogger("googleStrategy");

export const scope = [
  "profile",
  "email",
  "openid",
  "https://www.googleapis.com/auth/cloud-platform",
];

const strategyOptions: StrategyOptions = {
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_CALLBACK_URL,
  passReqToCallback: false,
  scope,
};

passport.serializeUser(({ id }: User, done) => {
  logger.info({
    message: `User has been serialized: ${id}`,
    service: "serializeUser",
  });
  return done(null, id);
});

passport.deserializeUser(async (id: string, done) => {
  const currentUser = await userRepository.getById(id);

  if (!currentUser)
    return done(
      new AuthenticationError({
        message: "User is not defined",
        service: "deserializeUser",
      }),
      false
    );

  logger.info({
    message: `User has been deserialized: ${currentUser.email}`,
    service: "deserializeUser",
  });

  return done(null, currentUser);
});

export default passport.use(
  new Strategy(strategyOptions, async (_, __, profile, done) => {
    const account = profile._json;
    let user: User;

    const existingUser: User = await userRepository.getByEmail(account.email);

    if (existingUser) {
      user = existingUser;
    } else {
      const newUser: User = {
        id: account.sub,
        email: account.email,
        imagePath: account.picture,
        role: "user",
        subscriptionExpiryDate: new Date().getDate().toLocaleString(),
        studyingLanguageLevel: "B1",
        nativeLanguage: "PL",
        tutorId: "en-US-Casual-K",
      };

      user = await userRepository.create(newUser);
    }

    if (!user)
      return done(
        new AuthenticationError({
          message: "User is not defined",
          service: "googleStrategy",
        }),
        false
      );

    logger.info({
      message: `User ${user.email} has been authenticated`,
      service: "googleStrategy",
    });

    return done(null, user);
  })
);
