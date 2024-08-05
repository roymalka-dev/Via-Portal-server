import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL || "";
const XRAY_CLIENT_ID = process.env.XRAY_CLIENT_ID || "";
const XRAY_CLIENT_SECRET = process.env.XRAY_CLIENT_SECRET || "";

interface TestCase {
  id: string;
  key: string;
  fields: {
    summary: string;
    labels: string[];
  };
}

const getXrayToken = async (): Promise<string> => {
  const response = await axios.post(
    "https://xray.cloud.getxray.app/api/v1/authenticate",
    {
      client_id: XRAY_CLIENT_ID,
      client_secret: XRAY_CLIENT_SECRET,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const jiraServices = {
  getTestCasesWithTags: async (
    tags: string[],
    projectKey: string
  ): Promise<string[]> => {
    try {
      const jql = `project = ${projectKey} AND (${tags
        .map((tag) => `labels = "${tag}"`)
        .join(" OR ")})`;

      let startAt = 0;
      const maxResults = 100; // Fetch 100 issues at a time
      let allTestCases: string[] = [];
      let total = 0;

      do {
        const response = await axios.get(`${JIRA_BASE_URL}/rest/api/3/search`, {
          params: { jql, startAt, maxResults },
          auth: {
            username: process.env.JIRA_API_EMAIL || "",
            password: process.env.JIRA_API_TOKEN || "",
          },
        });

        const { issues, total: totalResults } = response.data;
        allTestCases = allTestCases.concat(
          issues.map((issue: TestCase) => issue.key)
        );
        total = totalResults;
        startAt += maxResults;
      } while (startAt < total && allTestCases.length < 300); // Limit to 300 issues

      return allTestCases;
    } catch (error) {
      console.error("Error fetching test cases with tags:", error);
      throw error;
    }
  },

  createTestExecution: async (
    testCaseIds: string[],
    projectKey: string,
    name: string,
    parentIssueKey?: string
  ): Promise<string> => {
    try {
      const token = await getXrayToken();

      const payload = {
        testExecution: {
          fields: {
            project: {
              key: projectKey,
            },
            summary: `${name} Test Execution`,
            description: "Created via Tool API",
            issuetype: {
              name: "Test Execution",
            },
          },
        },
        tests: testCaseIds.map((testKey) => ({ testKey, status: "TODO" })),
      };

      console.log("Payload being sent to Xray:", JSON.stringify(payload));

      const response = await axios.post(
        "https://xray.cloud.getxray.app/api/v2/testexec",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const testExecutionKey = response.data.key;
      const testExecutionUrl = `${JIRA_BASE_URL}/browse/${testExecutionKey}`;

      // Link the test execution to the parent issue, if provided
      if (parentIssueKey) {
        const linkPayload = {
          type: {
            name: "Relates",
          },
          inwardIssue: {
            key: testExecutionKey,
          },
          outwardIssue: {
            key: parentIssueKey,
          },
          comment: {
            body: {
              type: "doc",
              version: 1,
              content: [],
            },
          },
        };

        await axios.post(`${JIRA_BASE_URL}/rest/api/3/issueLink`, linkPayload, {
          auth: {
            username: process.env.JIRA_API_EMAIL || "",
            password: process.env.JIRA_API_TOKEN || "",
          },
        });
      }

      return testExecutionUrl;
    } catch (error: any) {
      console.error(
        "Error creating test execution:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
