import { Router } from "express";
import {
  generateAdminToken,
  generateToken,
} from "../controllers/authController.js";
import { sanitizeEmail } from "../lib/validators.js";

const authRouter = Router();

authRouter.post("/token", sanitizeEmail, generateToken);

authRouter.post("/admin/token", sanitizeEmail, generateAdminToken);

export default authRouter;
