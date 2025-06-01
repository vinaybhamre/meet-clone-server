import { Router } from "express";

import {
  getCurrentUser,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import {
  validateLogin,
  validateSignUp,
} from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", validateSignUp, signup);
authRouter.post("/login", validateLogin, login);
authRouter.post("/logout", logout);
authRouter.get("/me", getCurrentUser);

export default authRouter;
