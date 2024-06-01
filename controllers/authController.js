import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

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
    const avatar = gravatar.url(email);
    const result = await User.create({
      email,
      password: passwordHash,
      avatarURL: avatar,
    });

    res.status(201).json({
      user: {
        email: result.email,
        subscription: result.subscription,
      },
    });
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
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECREET, {
      expiresIn: "24h",
    });

    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function currentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (err) {
    next(err);
  }
}

export default { register, login, logout, currentUser };
