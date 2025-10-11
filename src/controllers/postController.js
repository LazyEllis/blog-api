import { ForbiddenError, NotFoundError } from "../lib/errors.js";
import prisma from "../lib/prisma.js";

export const listPublishedPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    omit: {
      authorId: true,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  res.json(posts);
};

export const getPost = async (req, res) => {
  const { postId } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
    omit: {
      authorId: true,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  if (post.status === "DRAFT" && post.author.id !== req.user?.id) {
    throw new ForbiddenError("You do not have permission to access this post");
  }

  res.json(post);
};

export const createPost = async (req, res) => {
  const { id } = req.user;
  const { title, content, status } = req.body;

  const post = await prisma.post.create({
    data: { title, content, status, authorId: id },
    omit: {
      authorId: true,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  const { id } = req.user;
  const { postId } = req.params;
  const { title, content, status } = req.body;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  if (post.authorId !== id) {
    throw new ForbiddenError("You do not have permission to edit this post");
  }

  const updatedPost = await prisma.post.update({
    data: { title, content, status },
    where: {
      id: Number(postId),
    },
    omit: {
      authorId: true,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.user;
  const { postId } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  if (post.authorId !== id) {
    throw new ForbiddenError("You do not have permission to delete this post");
  }

  await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });

  res.status(204).end();
};
