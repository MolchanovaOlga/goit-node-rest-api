import express from "express";

import userController from "../controllers/userController.js";
import uploadMiddleware from "../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.patch(
  "/",
  uploadMiddleware.single("avatar"),
  userController.changeAvatar
);

export default usersRouter;
