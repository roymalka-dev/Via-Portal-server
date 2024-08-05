import { Request, Response } from "express";
import { scopingServices } from "../services/scoping.services";
import logger from "../logger/logger";

export const scopingControllers = {
  createConfluencePage: async (req: Request, res: Response) => {
    const { title, parentPageId, spaceKey, content } = req.body;

    try {
      const result = await scopingServices.createConfluencePage(
        title,
        parentPageId,
        spaceKey,
        content
      );
      res.status(201).json(result);
    } catch (error: any) {
      logger.error("createConfluencePage", {
        tag: "error",
        location: "scoping.controllers.ts: createConfluencePage",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: error.message });
    }
  },
  getCityCheckJobCSV: async (req: Request, res: Response) => {
    const { cityId } = req.body;

    try {
      const csvData = await scopingServices.getCityCheckJobCSV(cityId);
      return res.status(200).json(csvData);
    } catch (error: any) {
      logger.error("getCityCheckJobCSV", {
        tag: "error",
        location: "scoping.controllers.ts: getCityCheckJobCSV",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: error.message });
    }
  },
  createFromTemplate: async (req: Request, res: Response) => {
    const {
      templatePageId,
      newPageTitle,
      parentPageId,
      spaceKey,
      placeholders,
    } = req.body;

    try {
      const result = await scopingServices.createFromTemplate(
        templatePageId,
        newPageTitle,
        parentPageId,
        spaceKey,
        placeholders
      );
      res.status(201).json(result);
    } catch (error: any) {
      console.log(error);
      logger.error("createFromTemplate", {
        tag: "error",
        location: "scoping.controllers.ts: createFromTemplate",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: error.message });
    }
  },
};
