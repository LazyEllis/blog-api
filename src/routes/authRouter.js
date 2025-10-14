import { Router } from "express";
import { generateToken } from "../controllers/authController.js";
import { sanitizeEmail } from "../lib/validators.js";

const authRouter = Router();

authRouter.post("/token", sanitizeEmail, generateToken);

export default authRouter;
