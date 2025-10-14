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
  body("name")
    .trim()
    .notEmpty()
    .withMessage("You must enter your display name")
    .isLength({ max: 50 })
    .withMessage("Your display name must be within 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("You must enter your email.")
    .isEmail()
    .withMessage("You must enter a valid email.")
    .toLowerCase()
    .bail()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: { email: value },
      });

      if (user) {
        throw new Error("This email is already in use.");
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

export const sanitizeEmail = body("email").trim().toLowerCase();

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
