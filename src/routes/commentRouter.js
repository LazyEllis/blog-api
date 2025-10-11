import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComment,
  listComments,
  updateComment,
} from "../controllers/commentController.js";
import { optionalAuth, requireAuth } from "../lib/auth.js";
import { checkPostExists } from "../lib/utils.js";
import { validateComment } from "../lib/validators.js";

const commentRouter = Router({ mergeParams: true });

commentRouter.get("/", optionalAuth, checkPostExists, listComments);

commentRouter.get("/:commentId", optionalAuth, checkPostExists, getComment);

commentRouter.post(
  "/",
  requireAuth,
  checkPostExists,
  validateComment,
  createComment,
);

commentRouter.put(
  "/:commentId",
  requireAuth,
  checkPostExists,
  validateComment,
  updateComment,
);

commentRouter.delete(
  "/:commentId",
  requireAuth,
  checkPostExists,
  deleteComment,
);

export default commentRouter;
