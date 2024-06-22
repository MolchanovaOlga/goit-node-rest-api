import jwt from "jsonwebtoken";

import User from "../models/user.js";

function auth(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const [bearer, token] = authorizationHeader.split(" ", 2);

    if (bearer !== "Bearer") {
      return res.status(401).json({ message: "Invalid token" });
    }

    jwt.verify(token, process.env.JWT_SECREET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      }

      try {
        const user = await User.findById(decoded.id);

        if (!user) {
          return res.status(401).json({ message: "Not authorized" });
        }

        if (user.token !== token) {
          return res.status(401).json({ message: "Not authorized" });
        }

        req.user = { id: decoded.id, email: decoded.email };

        next();
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
}

export default auth;
