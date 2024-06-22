import Redis from "ioredis";

export const redis = new Redis({
  port: 6379,
  host: "127.0.0.1",
});

export const startRedisClient = () => {
  try {
    redis.on("connect", () => {
      console.log("Redis client connected");
    });

    redis.on("error", (err) => {
      throw err;
    });
  } catch (err) {
    console.error(err);
  }
};
