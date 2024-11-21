import passport, { use } from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import { User } from "../db/schema";
import userRepository from "../repositories/userRepository";
import logger from "../config/logger";
import AuthenticationError from "../errors/authenticationError";

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
  logger.info(`SerializeFC: User has been serialized: ${id}`);
  return done(null, id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const currentUser = await userRepository.getById(id);

    if (!currentUser) done(null, false);

    logger.info(`DeserializeFC: User has been deserialized: ${currentUser.email}`);
    done(null, currentUser);
  } catch (err) {
    done(
      new AuthenticationError({
        message: err.message,
        stack: err.stack,
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
          imagePaths: account.picture,
          role: "user",
          subscriptionExpiryDate: "2024-11-17",
        };

        user = await userRepository.create(newUser);
      }

      logger.info(`GoogleStrategy: User ${user.email} has been authenticated`);
      done(null, user);
    } catch (err) {
      done(
        new AuthenticationError({
          message: err.message,
          stack: err.stack,
        })
      );
    }
  })
);

// http://localhost:5000/api/v1/auth/google
