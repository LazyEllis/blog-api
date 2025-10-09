import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  res.json(user);
};
