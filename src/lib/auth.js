import passport from "passport";
import { ForbiddenError } from "./errors.js";

export const requireAuth = passport.authenticate("jwt", { session: false });

export const optionalAuth = passport.authenticate(["jwt", "anonymous"], {
  session: false,
});

export const requireAdmin = [
  requireAuth,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      throw new ForbiddenError(
        "You do not have permission to perform this action",
      );
    }

    next();
  },
];
