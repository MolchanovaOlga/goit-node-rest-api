import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/auth.js";

const usersRouter = express.Router();

usersRouter.post("/register", authController.register);
usersRouter.post("/login", authController.login);
usersRouter.post("/logout", authMiddleware, authController.logout);
usersRouter.get("/current", authMiddleware, authController.currentUser);

export default usersRouter;
