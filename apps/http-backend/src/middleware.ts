import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { DecodedPayload } from "./global.js";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization || "";
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "",
  ) as DecodedPayload;
  if (decoded) {
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    }
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};
