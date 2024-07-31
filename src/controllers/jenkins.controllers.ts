import { Request, Response } from "express";
import { jenkinsServices } from "../services/jenkins.services";
import logger from "../logger/logger";

export const jenkinsControllers = {
  cityCheckJob: async (req: Request, res: Response): Promise<void> => {
    try {
      const { cityId, configs } = req.body;

      if (!cityId || !configs) {
        res.status(400).json({ message: "cityId and configs are required" });
        return;
      }

      if (!Array.isArray(configs)) {
        res.status(400).json({ message: "configs must be an array" });
        return;
      }

      await jenkinsServices.cityCheckJob(cityId, configs);
      res.status(200).json({ message: "Jenkins job triggered successfully" });
      return;
    } catch (error: any) {
      logger.error("cityCheckJob", {
        tag: "error",
        location: "jenkins.controllers.ts: cityCheckJob",
        error: req?.session?.user + " " + error,
      });
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
