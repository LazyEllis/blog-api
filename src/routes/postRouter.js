import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  listPublishedPosts,
  updatePost,
} from "../controllers/postController.js";
import { optionalAuth, requireAuth } from "../lib/auth.js";
import { validatePost } from "../lib/validators.js";

const postRouter = Router();

postRouter.get("/", listPublishedPosts);

postRouter.get("/:postId", optionalAuth, getPost);

postRouter.post("/", requireAuth, validatePost, createPost);

postRouter.put("/:postId", requireAuth, validatePost, updatePost);

postRouter.delete("/:postId", requireAuth, deletePost);

export default postRouter;
