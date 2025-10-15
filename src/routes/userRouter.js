import { Router } from "express";
import {
  createUser,
  getCurrentUserProfile,
} from "../controllers/userController.js";
import { validateUser } from "../lib/validators.js";
import { requireAuth } from "../lib/auth.js";

const userRouter = Router();

userRouter.post("/", validateUser, createUser);

userRouter.get("/me", requireAuth, getCurrentUserProfile);

export default userRouter;
