import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  listPublishedPosts,
  updatePost,
} from "../controllers/postController.js";
import { optionalAuth, requireAdmin } from "../lib/auth.js";
import { validatePost } from "../lib/validators.js";

const postRouter = Router();

postRouter.get("/", listPublishedPosts);

postRouter.get("/:postId", optionalAuth, getPost);

postRouter.post("/", requireAdmin, validatePost, createPost);

postRouter.put("/:postId", requireAdmin, validatePost, updatePost);

postRouter.delete("/:postId", requireAdmin, deletePost);

export default postRouter;
