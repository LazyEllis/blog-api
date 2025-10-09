import { Router } from "express";
import { createUser } from "../controllers/userController.js";
import { validateUser } from "../lib/validators.js";

const userRouter = Router();

userRouter.post("/", validateUser, createUser);

export default userRouter;
