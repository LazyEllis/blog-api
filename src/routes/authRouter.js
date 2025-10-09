import { Router } from "express";
import { generateToken } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/token", generateToken);

export default authRouter;
