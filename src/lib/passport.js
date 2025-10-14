import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as AnonymousStrategy } from "passport-anonymous";
import prisma from "./prisma.js";
import bcrypt from "bcryptjs";

const LOCAL_STRATEGY_CONFIG = { usernameField: "email" };

const JWT_STRATEGY_CONFIG = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new LocalStrategy(LOCAL_STRATEGY_CONFIG, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);

passport.use(
  new JWTStrategy(JWT_STRATEGY_CONFIG, async (jwt_payload, done) => {
    try {
      return done(null, { id: jwt_payload.sub });
    } catch (error) {
      done(error);
    }
  }),
);

passport.use(new AnonymousStrategy());
