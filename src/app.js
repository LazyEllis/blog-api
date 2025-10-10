import "dotenv/config";
import express from "express";
import cors from "cors";
import "./lib/passport.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import postRouter from "./routes/postRouter.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/posts", postRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
