import { body, validationResult } from "express-validator";
import prisma from "./prisma.js";

const validate = (validators) => [
  validators,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

export const validateUser = validate([
  body("username")
    .trim()
    .notEmpty()
    .withMessage("You must enter your username.")
    .isAlphanumeric("en-US", { ignore: "_.-" })
    .withMessage(
      "Your username must only contain letters, numbers, underscores, periods and hyphens.",
    )
    .bail()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: { username: value },
      });

      if (user) {
        throw new Error("This username is already in use.");
      }
    }),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Your password must have at least 8 characters containing at least a lowercase and uppercase letter, a number and a symbol.",
    ),
  body("passwordConfirmation")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The passwords must match."),
]);

export const validatePost = validate([
  body("title")
    .trim()
    .notEmpty()
    .withMessage("You must enter a title for your post."),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("You must enter content for your post."),
  body("isPublished")
    .isBoolean()
    .toBoolean()
    .withMessage("Please specify whether the post is published or not."),
]);

export const validateComment = validate([
  body("content")
    .trim()
    .notEmpty()
    .withMessage("You must enter content for your comment."),
]);
