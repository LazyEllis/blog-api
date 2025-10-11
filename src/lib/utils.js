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

  if (post.status === "DRAFT") {
    throw new ForbiddenError(
      post.authorId !== req.user?.id
        ? "You do not have permission to access this post"
        : "Comments on unpublished posts cannot be accessed",
    );
  }

  next();
};
