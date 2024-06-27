import { Request, Response } from "express";
import { checklistServices } from "../services/checklist.services";
import mongoose from "mongoose";
import logger from "../logger/logger";

export const checklistControllers = {
  // Controller to get all checklist items
  getAllItems: async (req: Request, res: Response) => {
    try {
      const items = await checklistServices.getAllItems();
      const tags = await checklistServices.getAllChecklistTags();
      res.status(200).json({ data: { items, tags } });
    } catch (error: any) {
      logger.error(`getAllItems`, {
        tag: "error",
        location: "checklist.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: error });
    }
  },

  // Controller to add a new checklist item
  addItem: async (req: Request, res: Response) => {
    try {
      const newItem = await checklistServices.addItem(req.body);
      res.status(201).json(newItem);
    } catch (error: any) {
      logger.error(`addItem`, {
        tag: "error",
        location: "checklist.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: error });
    }
  },

  // Controller to remove a checklist item by ID
  removeItem: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await checklistServices.removeItem(new mongoose.Types.ObjectId(id));
      res.status(204).json({ message: "Item removed" });
    } catch (error: any) {
      logger.error(`removeItem`, {
        tag: "error",
        location: "checklist.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: error });
    }
  },

  // Controller to edit a checklist item by ID
  editItem: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const updatedItem = await checklistServices.editItem(
        new mongoose.Types.ObjectId(id),
        req.body
      );
      if (updatedItem) {
        res.status(200).json(updatedItem);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error: any) {
      logger.error(`editItem`, {
        tag: "error",
        location: "checklist.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: error });
    }
  },

  // Controller to add multiple checklist items from JSON
  addItemsFromJson: async (req: Request, res: Response) => {
    try {
      const jsonData = req.body; // Assuming the JSON data is sent in the request body
      const createdItems = [];

      for (const item of jsonData) {
        const newItemData: any = {
          name: item.name,
          description: item.description,
          url: item.url,
          tags: [], // Add empty tags array
        };

        const newItem = await checklistServices.addItem(newItemData);
        createdItems.push(newItem);
      }

      res.status(201).json(createdItems);
    } catch (error: any) {
      logger.error(`addItemsFromJson`, {
        tag: "error",
        location: "checklist.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: error });
    }
  },
  getAllChecklistTags: async (req: Request, res: Response) => {
    try {
      const tags = await checklistServices.getAllChecklistTags();
      res.status(200).json({ data: tags });
    } catch (error: any) {
      logger.error(`getAllChecklistTags`, {
        tag: "error",
        location: "checklist.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error });
    }
  },
  addTag: async (req: Request, res: Response) => {
    const { name } = req.body;
    console.log(name);
    try {
      const tag = await checklistServices.addChecklistTag(name);
      return res.status(201).json({ data: tag });
    } catch (error: any) {
      logger.error(`addTag ${error}`, {
        tag: "error",
        location: "checklist.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error });
    }
  },
  deleteTag: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await checklistServices.deleteChecklistTag(
        new mongoose.Types.ObjectId(id)
      );
      return res.status(204).json({ message: "Tag removed" });
    } catch (error: any) {
      logger.error(`removeTag`, {
        tag: "error",
        location: "checklist.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error });
    }
  },
  editTag: async (req: Request, res: Response) => {
    const id = req.body._id;
    const name = req.body.name;

    try {
      const tag = await checklistServices.editChecklistTag(name, id);
      return res.status(201).json({ data: tag });
    } catch (error: any) {
      logger.error(`editTag`, {
        tag: "error",
        location: "checklist.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error });
    }
  },
};
