import "express";
import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


export interface DecodedPayload extends JwtPayload{
  userId?: string;
}