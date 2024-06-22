import { Request, Response } from "express";
import { loggerServices } from "../services/logger.services";
import logger from "../logger/logger";

export const loggerControllers = {
  getLogsByDate: async (req: Request, res: Response) => {
    const date = req.query.date;
    try {
      const logs = await loggerServices.getLogsByDate(String(date));
      res.status(200).json({ data: logs });
    } catch (error: any) {
      logger.error(`Failed to retrieve logs for date ${date}`, {
        tag: "error",
        location: "logs.controllers.ts",
        error: error.message,
      });
      res.status(500).send("Failed to retrieve logs");
    }
  },
};
