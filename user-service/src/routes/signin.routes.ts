import { Router } from "express";
import { signinWithEmail, handleAuthenticate, authenticationMiddleware, handleRedirectAndSignIn } from "../controllers/signin.controller";

export const signinRouter = Router();
    
signinRouter.post("/email", signinWithEmail);

// redirect routes to oauth server
signinRouter.get("/google", handleAuthenticate);

// redirect routes here after user signs in
signinRouter.get('/google/callback', authenticationMiddleware, handleRedirectAndSignIn);
