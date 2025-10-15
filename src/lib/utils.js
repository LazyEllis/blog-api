import { ForbiddenError, NotFoundError } from "./errors.js";
import prisma from "./prisma.js";

export const checkPostExists = async (req, res, next) => {
  const { postId } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!post) {
    throw new NotFoundError("Post Not Found");
  }

  if (!post.isPublished && !req.user?.isAdmin) {
    throw new ForbiddenError("You do not have permission to access this post");
  }

  if (!post.isPublished && req.method === "POST") {
    throw new ForbiddenError("You cannot create comments on unpublished posts");
  }

  next();
};
