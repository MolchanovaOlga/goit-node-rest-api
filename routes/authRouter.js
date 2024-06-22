import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authMiddleware, authController.logout);
authRouter.get("/current", authMiddleware, authController.currentUser);
authRouter.get("/verify/:token", authController.verifyEmail);
authRouter.post("/verify", authController.resendVerifyEmail);

export default authRouter;
