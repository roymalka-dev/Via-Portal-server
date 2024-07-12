import { Request, Response } from "express";
import { scopingServices } from "../services/scoping.services";

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
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
};
