import * as fs from "node:fs/promises";
import path from "node:path";

import User from "../models/user.js";

async function changeAvatar(req, res, next) {
  try {
    const newPath = path.resolve("public", "avatars", req.file.filename);

    if (!newPath) {
      return res.status(404).json({ message: "Not found" });
    }

    await fs.rename(req.file.path, newPath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: req.file.filename,
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
