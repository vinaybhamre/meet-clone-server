import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import User from "../models/auth.model.js";
import { getHashedPassword, verifyPassword } from "../utils/index.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const signup: RequestHandler = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({ message: "User already exists!" });
      return;
    }

    const hashedPassword = await getHashedPassword(password as string);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: user.email, id: user._id, name: user.name },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Set token in HttpOnly cookie:
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // set true on production
    });

    res.status(201).json({
      user: { email: user.email, id: user._id, name: user.name },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Something went wrong. Please try again!" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      res.status(404).json({ message: "Invalid Credentials!" });
      return;
    }

    const isPasswordMatch = await verifyPassword(
      userExist.password,
      password as string,
    );
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Invalid Credentials!" });
      return;
    }

    const token = jwt.sign(
      { email: userExist.email, id: userExist._id, name: userExist.name },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      user: { email: userExist.email, id: userExist._id, name: userExist.name },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Something went wrong. Please try again!" });
  }
};

export const logout: RequestHandler = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser: RequestHandler = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    res.status(200).json({
      user: {
        email: decoded.email,
        id: decoded.id,
        name: decoded.name,
      },
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
