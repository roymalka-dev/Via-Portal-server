import mongoose from "mongoose";
import { ChecklistItem, IChecklistItem } from "../models/checklist/item.model";
import { Tag } from "../models/checklist/tag.model";
import { add } from "winston";

export const checklistServices = {
  // Get all checklist items
  async getAllItems(): Promise<IChecklistItem[]> {
    try {
      return await ChecklistItem.find().exec();
    } catch (error) {
      throw new Error(`Error getting all items: ${error}`);
    }
  },

  // Add a new checklist item
  async addItem(
    itemData: Omit<IChecklistItem, "_id">
  ): Promise<IChecklistItem> {
    try {
      const newItem = new ChecklistItem(itemData);
      return await newItem.save();
    } catch (error) {
      throw new Error(`Error adding item: ${error}`);
    }
  },

  async addMultipleItems(items: any[]): Promise<IChecklistItem[]> {
    const addedItems: IChecklistItem[] = [];

    for (const item of items) {
      // Ensure tags are added before adding the item
      for (const tag of item.tags) {
        await this.addChecklistTag(tag);
      }
      const addedItem = await this.addItem(item);
      addedItems.push(addedItem);
    }

    return addedItems;
  },

  // Remove a checklist item by ID
  async removeItem(id: mongoose.Types.ObjectId): Promise<void> {
    try {
      await ChecklistItem.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Error removing item: ${error}`);
    }
  },

  // Edit a checklist item by ID
  async editItem(
    id: mongoose.Types.ObjectId,
    updateData: Partial<Omit<IChecklistItem, "_id">>
  ): Promise<IChecklistItem | null> {
    try {
      const updatedItem = await ChecklistItem.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).exec();
      return updatedItem;
    } catch (error) {
      throw new Error(`Error editing item: ${error}`);
    }
  },
  async getAllChecklistTags() {
    try {
      const tags = await Tag.find({}).exec();
      return tags;
    } catch (error) {
      throw new Error(`Error getting all tags: ${error}`);
    }
  },
  async addChecklistTag(name: string) {
    try {
      const existTag = await Tag.findOne({ name });
      if (existTag) {
        return;
      }
      const newTag = new Tag({ name });
      return await newTag.save();
    } catch (error) {
      throw new Error(`Error adding tag: ${error}`);
    }
  },
  async deleteChecklistTag(id: mongoose.Types.ObjectId) {
    try {
      await Tag.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Error editing tag: ${error}`);
    }
  },
  async editChecklistTag(name: string, id: string) {
    try {
      const updatedTag = await Tag.findByIdAndUpdate(id, { name });
      return updatedTag;
    } catch (error) {
      throw new Error(`Error editing tag: ${error}`);
    }
  },
};
