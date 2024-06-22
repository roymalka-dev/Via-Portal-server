import express from "express";
import http from "http";
import dotenv from "dotenv";
import { appConfig } from "./configs/app.config";
import { socketConfig } from "./configs/socket.config";

import { routes } from "./routes/routes";
import { router } from "./routes/router";
import { DBconnection } from "./db/db";
import logger from "./logger/logger";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "localhost";

appConfig(app);
socketConfig(server);
router("api", app, routes);

DBconnection()
  .then(() => {
    server.listen(PORT, HOST, () => {
      logger.info(` Server is running on http://${HOST}:${PORT}`, {
        tag: "server-started",
        location: "server.ts",
      });
    });
  })
  .catch((error: any) => {
    logger.error(`server start error`, {
      tag: "error",
      location: "server.ts",
      error: error.message,
    });
  });
