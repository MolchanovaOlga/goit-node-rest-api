import bcrypt from "bcrypt";

import User from "../models/user.js";
import { registerSchema } from "../schemas/authSchemas.js";

async function register(req, res, next) {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user !== null) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await User.create({ email, password: passwordHash });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export default { register };
