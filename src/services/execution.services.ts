import { Types } from "mongoose";
import { ChecklistExecution } from "../models/checklist/execution.model";
import { ChecklistItem } from "../models/checklist/item.model";
import { exec } from "child_process";

export const executionServices = {
  createExecution: async (data: {
    itemIds: Types.ObjectId[];
    name: string;
    tags: string[];
  }) => {
    const checklistItems = await ChecklistItem.find({
      _id: { $in: data.itemIds },
    });

    if (!checklistItems.length) {
      throw new Error("No checklist items found for the provided IDs");
    }

    const executionItems = checklistItems.map((item) => ({
      item: item._id,
      name: item.name,
      description: item.description,
      url: item.url,
      tags: item.tags,
      assignee: "Unassigned", // Default value
      dueDate: new Date(), // Default value
      status: "pending", // Default value
    }));

    const execution = new ChecklistExecution({
      items: executionItems,
      name: data.name,
      description: "No description", // Default value
      url: "No URL", // Default value
      tags: data.tags, // Default value
      assignee: "Unassigned", // Default value
      dueDate: new Date(), // Default value
      status: "pending", // Default value
    });

    await execution.save();
    return execution;
  },

  getExecution: async (id: Types.ObjectId) => {
    const execution = await ChecklistExecution.findById(id)
      .populate("items name url tags assignee dueDate status")
      .exec();

    return execution;
  },

  editItemStatus: async (
    executionId: Types.ObjectId,
    itemId: string,
    status: string
  ) => {
    const execution = await ChecklistExecution.findById(executionId);

    if (!execution) {
      throw new Error("Execution not found");
    }

    const item = execution.items.find((item: any) => item._id.equals(itemId));

    if (!item) {
      throw new Error("Item not found in this execution");
    }

    item.status = status;

    await execution.save();
    return execution;
  },

  editItemAssignee: async (
    executionId: Types.ObjectId,
    cardId: string,
    assignee: string
  ) => {
    const execution = await ChecklistExecution.findById(executionId);

    if (!execution) {
      throw new Error("Execution not found");
    }

    const item = execution.items.find((item: any) => item._id.equals(cardId));

    if (!item) {
      throw new Error("Item not found in this execution");
    }

    item.assignee = assignee;

    await execution.save();
    return execution;
  },
  getEditExecutionItems: async (executionId: string) => {
    const execution = await ChecklistExecution.findById(executionId);

    if (!execution) {
      throw new Error("Execution not found");
    }

    const ids = execution.items.map((item: any) => item.item._id);
    return ids;
  },

  deleteExecutionItem: async (executionId: string, itemId: string) => {
    const execution = await ChecklistExecution.findById(executionId);

    if (!execution) {
      throw new Error("Execution not found");
    }

    const itemIndex = execution.items.findIndex((item: any) =>
      item.item._id.equals(itemId)
    );

    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    execution.items.splice(itemIndex, 1);

    await execution.save();

    return execution;
  },

  addItemToExecution: async (executionId: string, itemId: string) => {
    const execution = await ChecklistExecution.findById(executionId);
    const item = await ChecklistItem.findById(itemId);

    if (!execution || !item) {
      throw new Error("Execution or item not found");
    }

    const newItem = {
      item: item._id,
      name: item.name,
      description: item.description,
      url: item.url,
      tags: item.tags,
      assignee: "Unassigned",
      timestamp: new Date(),
      status: "pending",
    };

    execution.items.push(newItem as any);

    await execution.save(); // Save the updated execution

    return execution;
  },
};
