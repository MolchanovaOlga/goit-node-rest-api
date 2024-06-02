import * as fs from "node:fs/promises";
import path from "node:path";

import User from "../models/user.js";
import changeSizeImg from "../services/jimp.js";

async function changeAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File not uploaded" });
    }
    const newPath = path.resolve("public", "avatars", req.file.filename);
    await changeSizeImg(req.file.path);
    await fs.rename(req.file.path, newPath);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: path.join("avatars", req.file.filename),
      },
      { new: true }
    );
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (err) {
    next(err);
  }
}

export default { changeAvatar };
