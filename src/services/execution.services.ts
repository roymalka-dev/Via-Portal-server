import { Types } from "mongoose";
import { ChecklistExecution } from "@/models/checklist/execution.model";
import { ChecklistItem } from "@/models/checklist/item.model";

export const executionServices = {
  createExecution: async (data: {
    itemIds: Types.ObjectId[];
    name: string;
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
      tags: [], // Default value
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
};
