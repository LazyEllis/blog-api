import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const getCurrentUserProfile = async (req, res) => {
  const { id } = req.user;

  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  });

  res.json(user);
};

export const listCurrentUserPosts = async (req, res) => {
  const { id } = req.user;

  const posts = await prisma.post.findMany({
    where: {
      authorId: id,
    },
    omit: {
      authorId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(posts);
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  res.status(201).json(user);
};
