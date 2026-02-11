import { NextFunction, Request, Response } from "express";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { IUser, IUserDTO, Role } from "../db/types";
import { AuthService } from "../auth.service";
import { UserRepository } from "../repository/user.repository";
import { UserService } from "../services/user.service";
import { buildJwtConfigFromEnv, JwtService } from "../services/jwt.service";
import { JwtPayload } from "jsonwebtoken";


const CLIENTID = process.env.CLIENT_ID??'';

const CLIENT_SECRET = process.env.CLIENT_SECRET??''
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository, userService);
const jwtConfig = buildJwtConfigFromEnv();
const jwtService = new JwtService(jwtConfig);
passport.use(new GoogleStrategy({ 
    clientID: CLIENTID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => { 
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    const id = profile.id; 
    const newUser: IUserDTO = { 
      name: profile.displayName,
      email: profile._json.email??'',
      googleSSOId:id,
      role: Role.ROLE_WORKSPACE_USER,
      workflows: [],
      createdAt: new Date()
    }
    const user = await authService.authenticateUserWithgoogleSSO(id, newUser);
    return done(null, user);
  } 
));

const firstId = '100084513316273882044'
const secondId = '100084513316273882044';
export const signinWithEmail = (_req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "signin email" });
};

export const handleAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  console.log("here")
  try { 
    const authenticate = passport.authenticate('google', {scope: ['profile', 'email']});
    authenticate(req, res, next)
  } catch(err) { 
    next(err);
  }
};

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try { 
    const authenticate = passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false}); 
    authenticate(req, res, next);
  } catch(err) { 
    next(err)
  }
}


export const handleRedirectAndSignIn = (req: Request, res: Response) => { 
  console.log("here in redirect");
  console.log(req.user);
  const user= req.user as any;
  const userId = user._id;
  const payload : JwtPayload = {
    admin: (user.role==0)?false:true
  };
  const {accessToken, refreshToken} = jwtService.signTokenPair(payload, user.email)
  res.redirect(`http://localhost:5173/dashboard?accessToken=${accessToken}&refreshToken=${refreshToken}&userId=${userId}`);
}

export {passport as googlePassport};
