import bcrypt from "bcrypt";

import User from "../models/user.js";
import { registerLoginSchema } from "../schemas/authSchemas.js";

async function register(req, res, next) {
  try {
    const { error } = registerLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await User.create({ email, password: passwordHash });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { error } = registerLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("wrong email");
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("wrong password");
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    res.status(200).json({ token: "TOKEN" });
  } catch (err) {
    next(err);
  }
}

export default { register, login };
