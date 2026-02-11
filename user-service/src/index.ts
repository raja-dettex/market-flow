import express, { Request, Response, NextFunction } from "express";
import { signinRouter } from "./routes/signin.routes";
import { workflowRouter } from "./routes/workflow.routes";
import { connect } from "./db/mongo.client";
import cors, {CorsOptions} from 'cors';
import session from 'express-session';
import { googlePassport } from "./controllers/signin.controller";
import dotenv from 'dotenv';

// dotenv config
dotenv.config({path: 'C:\\Users\\Admin\\cohort-building-xyg\\market-flow\\user-service\\.env'});
console.log(process.env)
const app = express();

app.use(express.json());

// cors middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(session({secret: 'my-secret', resave: false, saveUninitialized: false}));
// app.use(googlePassport.initialize());
// app.use(googlePassport.session())


app.use("/auth", signinRouter);
app.use("/workflow", workflowRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = Number(process.env.PORT ?? 8000);
connect().then((connected) => { 
    app.listen(port, () => {
        console.log(`user-service listening on port ${port}`);
      });
}).catch(err => { 
  console.log(err);
  console.error("failed to connect to mongo client: "  +  err)
})

