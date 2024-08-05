import { redis } from "../db/redis";
import { Request, Response, NextFunction, RequestHandler } from "express";

// Extend Request interface to include cacheDuration
declare module "express-serve-static-core" {
  interface Request {
    cacheDuration?: number;
  }
}

export const redisGetRequestCache = (
  durationInMinutes: number
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") {
      return next();
    }

    const key = `get-request-${req.originalUrl || req.url}`;

    // Use the passed duration or a default value if not provided
    const cacheDuration = durationInMinutes || 30;

    try {
      const cachedData = await redis.get(key);
      if (cachedData != null) {
        res.setHeader("X-Cache", "HIT");
        res.send(JSON.parse(cachedData));
      } else {
        const originalSend = res.send.bind(res);
        res.send = (body: any): Response<any, Record<string, any>> => {
          redis
            .set(key, JSON.stringify(body), "EX", cacheDuration * 60) // Cache duration in seconds
            .catch((err: any) => console.error("Redis set error:", err));
          return originalSend(body);
        };
        next();
      }
    } catch (err) {
      console.error("Redis get error:", err);
      next(err);
    }
  };
};
