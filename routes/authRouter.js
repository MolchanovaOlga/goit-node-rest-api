import express from "express";
import authController from "../controllers/authController.js";

const usersRouter = express.Router();

usersRouter.post("/register", authController.register);

export default usersRouter;
