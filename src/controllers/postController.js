import { ForbiddenError, NotFoundError } from "../lib/errors.js";
import prisma from "../lib/prisma.js";

export const listPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    ...(!req.user?.isAdmin && {
      where: {
        isPublished: true,
      },
    }),
    orderBy: {
      createdAt: "desc",
    },
    include: {
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
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  if (!post.isPublished && !req.user?.isAdmin) {
    throw new ForbiddenError("You do not have permission to access this post");
  }

  res.json(post);
};

export const createPost = async (req, res) => {
  const { title, content, isPublished } = req.body;

  const post = await prisma.post.create({
    data: { title, content, isPublished },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content, isPublished } = req.body;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  const updatedPost = await prisma.post.update({
    data: { title, content, isPublished },
    where: {
      id: Number(postId),
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });

  res.status(204).end();
};
