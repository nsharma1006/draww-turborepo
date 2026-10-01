import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { DecodedPayload } from "./global.js";
import {JWT_PASS} from "@repo/backend-common/config"

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization || "";
  const decoded = jwt.verify(
    token,
    JWT_PASS,
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
