import { ForbiddenError, NotFoundError } from "../lib/errors.js";
import prisma from "../lib/prisma.js";

export const listComments = async (req, res) => {
  const { postId } = req.params;

  const comments = await prisma.comment.findMany({
    where: {
      postId: Number(postId),
    },
    omit: {
      authorId: true,
      postId: true,
    },
    include: {
      author: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.json(comments);
};

export const getComment = async (req, res) => {
  const { postId, commentId } = req.params;

  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(commentId),
      postId: Number(postId),
    },
    omit: {
      authorId: true,
      postId: true,
    },
    include: {
      author: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
  });

  if (!comment) {
    throw new NotFoundError("Comment Not Found");
  }

  res.json(comment);
};

export const createComment = async (req, res) => {
  const { id } = req.user;
  const { postId } = req.params;
  const { content } = req.body;

  const comment = await prisma.comment.create({
    data: {
      content,
      postId: Number(postId),
      authorId: Number(id),
    },
    omit: {
      authorId: true,
      postId: true,
    },
    include: {
      author: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
  });

  res.status(201).json(comment);
};

export const updateComment = async (req, res) => {
  const { id, isAdmin } = req.user;
  const { postId, commentId } = req.params;
  const { content } = req.body;

  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(commentId),
      postId: Number(postId),
    },
  });

  if (!comment) {
    throw new NotFoundError("Comment Not Found");
  }

  if (comment.authorId !== id && !isAdmin) {
    throw new ForbiddenError(
      "You do not have permission to update this comment",
    );
  }

  const updatedComment = await prisma.comment.update({
    data: {
      content,
    },
    omit: {
      authorId: true,
      postId: true,
    },
    include: {
      author: {
        omit: {
          email: true,
          password: true,
        },
      },
    },
    where: {
      id: Number(commentId),
    },
  });

  res.json(updatedComment);
};

export const deleteComment = async (req, res) => {
  const { id, isAdmin } = req.user;
  const { postId, commentId } = req.params;

  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(commentId),
      postId: Number(postId),
    },
  });

  if (!comment) {
    throw new NotFoundError("Comment Not Found");
  }

  if (comment.authorId !== id && !isAdmin) {
    throw new ForbiddenError(
      "You do not have permission to delete this comment",
    );
  }

  await prisma.comment.delete({
    where: {
      id: Number(commentId),
    },
  });

  res.status(204).end();
};
