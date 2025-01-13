import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import { User } from "../../../shared/services/db/schema";
import UserRepository from "@shared/repositories/userRepository";
import { config } from "@root/config";
import AuthenticationError from "../../../shared/errors/authenticationError";

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
  try {
    const currentUser = await userRepository.getById(id);

    console.log(currentUser);

    if (!currentUser) return done(null, false);

    logger.info({
      message: `User has been deserialized: ${currentUser.email}`,
      service: "deserializeUser",
    });

    return done(null, currentUser);
  } catch (err) {
    return done(
      new AuthenticationError({
        message: err.message,
        stack: err.stack,
        service: "deserializeUser",
      }),
      null
    );
  }
});

export default passport.use(
  new Strategy(strategyOptions, async (_, __, profile, done) => {
    const account = profile._json;
    let user: User;

    try {
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

      logger.info({
        message: `User ${user.email} has been authenticated`,
        service: "googleStrategy",
      });
      return done(null, user);
    } catch (err) {
      return done(
        new AuthenticationError({
          message: err.message,
          stack: err.stack,
          service: "googleStrategy",
        })
      );
    }
  })
);
