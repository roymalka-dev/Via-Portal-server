import { Request, Response } from "express";
import { jenkinsServices } from "../services/jenkins.services";
import logger from "@/logger/logger";

export const jenkinsControllers = {
  cityCheckJob: async (req: Request, res: Response) => {
    try {
      const { cityId, configs } = req.body;

      if (!cityId || !configs) {
        return res
          .status(400)
          .json({ message: "cityId and configs are required" });
      }

      if (!Array.isArray(configs)) {
        return res.status(400).json({ message: "configs must be an array" });
      }

      await jenkinsServices.cityCheckJob(cityId, configs);
      res.status(200).json({ message: "Jenkins job triggered successfully" });
    } catch (error: any) {
      logger.error("cityCheckJob", {
        tag: "error",
        location: "jenkins.controllers.ts: cityCheckJob",
        error: req?.session?.user + " " + error.message,
      });
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
