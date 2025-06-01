import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import authRouter from "./routes/auth.route.js";

const app = express();

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    origin: process.env.FRONTEND_ORIGIN,
  }),
);

app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.json("hello from meet!");
});

app.use("/api/v1/auth", authRouter);

export default app;
