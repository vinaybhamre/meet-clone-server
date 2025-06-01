import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const handleValidationErrors: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array(), message: "Invalid Input" });
    return;
  }
  next();
};

export const validateSignUp: RequestHandler[] = [
  body("name").notEmpty().withMessage("name is required"),
  body("email").isEmail().withMessage("valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 characters"),
  handleValidationErrors,
];

export const validateLogin: RequestHandler[] = [
  body("email").isEmail().withMessage("valid email is required"),
  body("password").notEmpty().withMessage("password is required"),
  handleValidationErrors,
];

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
