import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import crypto from "node:crypto";

import User from "../models/user.js";
import { registerLoginSchema } from "../schemas/authSchemas.js";
import mail from "../services/nodemailer.js";

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

    const verificationToken = crypto.randomUUID();

    mail.sendMail({
      to: email,
      from: "designer.molchanova@gmail.com",
      subject: "Welcome to Phonebook!",
      html: `To confirm your email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">Link</a>`,
      text: `To confirm your email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    const result = await User.create({
      email,
      password: passwordHash,
      avatarURL: avatar,
      verificationToken,
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

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    console.log(user._id);

    res.status(200).json({ message: "Verification successful" });
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

    if (user.verify === false) {
      return res.status(401).json({ message: "Please verify your email" });
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

export default { register, login, logout, currentUser, verifyEmail };
