import bodyParser from "body-parser";
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { Request, Response } from "express";
import { startRedisClient, redis } from "@/db/redis";
import session from "express-session";
import RedisStore from "connect-redis";

export const appConfig = (app: Application) => {
  app.use(express.json({ limit: "30mb" }));

  app.use(bodyParser.json({ limit: "30mb" }));
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

  startRedisClient();

  app.use(
    session({
      store: new RedisStore({ client: redis }),
      secret: "process.env.SESSION_SECRET",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "DEV" ? false : false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(
    cors({
      credentials: true,
      origin:
        process.env.NODE_ENV === "DEV"
          ? [process.env.LOCAL_HOST_URL_CORS || ""]
          : ([
              process.env.PRODUCTION_CORS_URL1 || "",
              process.env.PRODUCTION_CORS_URL2 || "",
              process.env.PRODUCTION_CORS_URL3 || "",
            ] as (string | boolean | RegExp)[]),
    })
  );

  app.get("/", (req: Request, res: Response) => {
    res.send("Portal server API");
  });

  process.env.NODE_ENV === "DEV" && app.use(morgan("common"));
};
