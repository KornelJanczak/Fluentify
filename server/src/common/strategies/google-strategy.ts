import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import { User } from "../db/schema";
import userRepository from "../repositories/userRepository";
import AuthenticationError from "../errors/authenticationError";
import logger from "../config/logger";

const strategyOptions: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/api/v1/auth/callback/google",
  passReqToCallback: false,
  scope: [
    "profile",
    "email",
    "openid",
    "https://www.googleapis.com/auth/cloud-platform",
  ],
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user: User, done) => {
  try {
    const findedUser = await userRepository.getById(user.id);

    if (!findedUser) done(null, false);

    done(null, findedUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(strategyOptions, async (_, __, profile, done) => {
    const account = profile._json;
    let user;
    console.log(account);

    console.log("image path", account.picture);

    try {
      // const existingUser = await userRepository.getByEmail(account.email);

      // if (!existingUser) {
      //   const newUser: Partial<User> = {
      //     id: Number(account.sub),
      //     email: account.email,
      //     imagePaths: account.picture,
      //   };

      const createdUser = await userRepository.create(account.email, "");

      console.log(createdUser);

      //   await userRepository.getById(existingUser);

      //   user = newUser;
      // } else {
      //   user = existingUser;
      // }
      console.log("User", user);

      done(null, user);
    } catch (err) {
      done(err);
    }
  })
);
