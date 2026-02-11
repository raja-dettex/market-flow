import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { buildJwtConfigFromEnv, JwtService } from "../services/jwt.service";

export type AuthenticatedRequest = Request & { user?: JwtPayload };

const jwtService = new JwtService(buildJwtConfigFromEnv());

const getBearerToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getBearerToken(req);
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Missing bearer token" });
    }
    const payload = jwtService.verifyAccessToken(token);
    console.log(payload);
    //if(jwtService.isTokenExpired(payload.exp??-1)) return res.status(401).json({error: 'expired token'});
    (req as AuthenticatedRequest).user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
