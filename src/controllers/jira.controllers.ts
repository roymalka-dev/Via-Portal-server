import { Request, Response } from "express";
import { jiraServices } from "../services/jira.services";

export const jiraControllers = {
  createTestExecution: async (req: Request, res: Response): Promise<void> => {
    try {
      const { tags, projectKey, name, parentIssueKey } = req.body;

      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        res.status(400).json({ message: "tags must be a non-empty array" });
        return;
      }

      if (!projectKey) {
        res.status(400).json({ message: "projectKey is required" });
        return;
      }

      if (!name) {
        res.status(400).json({ message: "name is required" });
        return;
      }
      if (!parentIssueKey) {
        res.status(400).json({ message: "parentIssueKey is required" });
      }

      res.status(201).json({ message: "Test execution is currently disabled" });
      return;

      // Fetch test case IDs based on tags
      const testCaseIds = await jiraServices.getTestCasesWithTags(
        tags,
        projectKey
      );

      if (!testCaseIds || testCaseIds.length === 0) {
        res
          .status(400)
          .json({ message: "No test cases found with the provided tags" });
        return;
      }

      // Create test execution with the fetched test case IDs
      const testExecutionUrl = await jiraServices.createTestExecution(
        testCaseIds,
        projectKey,
        name,
        parentIssueKey
      );

      res.status(200).json({
        message: "Test execution created successfully",
        url: testExecutionUrl,
      });
    } catch (error: any) {
      console.error("Error creating test execution:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};
