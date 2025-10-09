import passport from "passport";

export const requireAuth = passport.authenticate("jwt", { session: false });

export const optionalAuth = passport.authenticate(["jwt", "anonymous"], {
  session: false,
});
