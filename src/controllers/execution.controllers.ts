import { Request, Response } from "express";
import { Types } from "mongoose";
import { executionServices } from "..//services/execution.services";
import { ChecklistItem } from "../models/checklist/item.model";
import { explorerServices } from "../services/explorer.services";
import logger from "../logger/logger";
import { ObjectId } from "mongodb";
import { userServices } from "../services/user.service";

const checklistFolderId = "66729b81627402502bbeada1";

export const executionControllers = {
  createExecution: async (req: Request, res: Response) => {
    const { name, tags } = req.body;

    try {
      // Find checklist items that have at least one of the provided tags
      const checklistItems = await ChecklistItem.find({
        tags: { $in: tags },
      });

      if (!checklistItems.length) {
        return res
          .status(404)
          .json({ message: "No checklist items found with the provided tags" });
      }

      // Extract item IDs from the found checklist items and cast them to Types.ObjectId[]
      const itemIds: Types.ObjectId[] = checklistItems.map(
        (item) => item._id as Types.ObjectId
      );

      // Prepare execution data
      const executionData = {
        itemIds,
        name,
        tags,
      };

      const execution = await executionServices.createExecution(executionData);

      const dataSchemaType = "ChecklistExecution";
      // Create file
      const file = await explorerServices.addFile(
        name,
        new ObjectId(checklistFolderId),
        execution._id,
        dataSchemaType
      );

      return res.status(201).json({ data: file });
    } catch (error: any) {
      logger.error("createExecution", {
        tag: "error",
        location: "execution.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getExecution: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const execution = await executionServices.getExecution(
        new Types.ObjectId(id)
      );

      const assigneesFilter = (a: any) => a.authorizations.includes("EXECUTER");

      const assignees = await userServices.getAllUsersAsAssignees(
        assigneesFilter
      );

      return res.status(200).json({ data: { execution, assignees } });
    } catch (error: any) {
      logger.error("getExecution", {
        tag: "error",
        location: "execution.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  editItemStatus: async (req: Request, res: Response) => {
    const { executionId, itemId, newStatus } = req.body;

    try {
      const updatedExecution = await executionServices.editItemStatus(
        executionId,
        itemId,
        newStatus as string
      );
      return res.status(200).json(updatedExecution);
    } catch (error: any) {
      logger.error("editItemStatus", {
        tag: "error",
        location: "execution.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  editItemAssignee: async (req: Request, res: Response) => {
    const { executionId, itemId, assignee } = req.body;

    try {
      const updatedExecution = await executionServices.editItemAssignee(
        executionId,
        itemId,
        assignee
      );
      return res.status(200).json(updatedExecution);
    } catch (error: any) {
      logger.error("editItemAssignee", {
        tag: "error",
        location: "execution.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
