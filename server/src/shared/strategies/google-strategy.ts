import passport, { use } from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import { User } from "../services/db/schema";
import { userRepository } from "../repositories/userRepository";
import { config } from "@root/config";
import AuthenticationError from "../errors/authenticationError";

const logger = config.createLogger("googleStrategy");

const strategyOptions: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  passReqToCallback: false,
  scope: [
    "profile",
    "email",
    "openid",
    "https://www.googleapis.com/auth/cloud-platform",
  ],
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
          subscriptionExpiryDate: "2024-11-17",
          studingLanguageLevel: "B1",
          nativeLanguage: "PL",
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
