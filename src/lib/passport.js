import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as AnonymousStrategy } from "passport-anonymous";
import prisma from "./prisma.js";
import bcrypt from "bcryptjs";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
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

const JWT_STRATEGY_OPTIONS = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JWTStrategy(JWT_STRATEGY_OPTIONS, async (jwt_payload, done) => {
    try {
      return done(null, { id: jwt_payload.sub });
    } catch (error) {
      done(error);
    }
  }),
);

passport.use(new AnonymousStrategy());
