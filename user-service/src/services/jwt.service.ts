import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type JwtServiceConfig = {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  issuer?: string;
  audience?: string;
};

export interface IJwtService {
  signAccessToken: (payload: JwtPayload, subject: string) => string;
  signRefreshToken: (payload: JwtPayload, subject: string) => string;
  signTokenPair: (payload: JwtPayload, subject: string) => TokenPair;
  verifyAccessToken: (token: string) => JwtPayload;
  verifyRefreshToken: (token: string) => JwtPayload;
  decode: (token: string) => JwtPayload | null;
}

const requiredEnv = (key: string): string | null => {
  const value = process.env[key];
  if (!value) {
    return null;
  }
  return value;
};

export const buildJwtConfigFromEnv = (): JwtServiceConfig => ({
  accessTokenSecret: requiredEnv("JWT_ACCESS_SECRET")??'accesssecret',
  refreshTokenSecret: requiredEnv("JWT_REFRESH_SECRET")??'refreshsercret',
  accessTokenExpiresIn: 900,
  refreshTokenExpiresIn: 2592000, 
  issuer: process.env.JWT_ISSUER??"mlmflow",
  audience: process.env.JWT_AUDIENCE??"audience",
});

export class JwtService implements IJwtService {
  private readonly accessOptions: SignOptions;
  private readonly refreshOptions: SignOptions;

  constructor(private readonly config: JwtServiceConfig) {  
    this.accessOptions = {
      expiresIn: config.accessTokenExpiresIn,
      issuer: config.issuer,
      audience: config.audience,
      algorithm: "HS256",
    };
    this.refreshOptions = {
      expiresIn: config.refreshTokenExpiresIn,
      issuer: config.issuer,
      audience: config.audience,
      algorithm: "HS256", 
    };
    console.log(this.accessOptions);
  }

  signAccessToken(payload: JwtPayload, subject: string): string {
    return jwt.sign(payload, this.config.accessTokenSecret, {...this.accessOptions, subject: subject});
  }

  signRefreshToken(payload: JwtPayload, subject: string): string {
    return jwt.sign(payload, this.config.refreshTokenSecret, { ...this.refreshOptions, subject: subject});
  }

  signTokenPair(payload: JwtPayload, subject: string): TokenPair {
    return {
      accessToken: this.signAccessToken(payload, subject),
      refreshToken: this.signRefreshToken(payload, subject),
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, this.config.accessTokenSecret, {
      issuer: this.config.issuer,
      audience: this.config.audience,
      algorithms: ["HS256"],
    });
    if (typeof decoded === "string") {
      throw new Error("Invalid access token payload");
    }
    return decoded;
  }

  verifyRefreshToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, this.config.refreshTokenSecret, {
      issuer: this.config.issuer,
      audience: this.config.audience,
      algorithms: ["HS256"],
    });
    if (typeof decoded === "string") {
      throw new Error("Invalid refresh token payload");
    }
    return decoded;
  }

  isTokenExpired(exp: number): boolean { 
    const currentTime = new Date();
    const expTime = new Date(exp);
    return currentTime > expTime;
  }
  decode(token: string): JwtPayload | null {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") {
      return null;
    }
    return decoded;
  }
}
