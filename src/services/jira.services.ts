import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL || "";
const JIRA_API_EMAIL = process.env.JIRA_API_EMAIL || "";
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || "";

interface TestCase {
  id: string;
  key: string;
  fields: {
    summary: string;
    labels: string[];
  };
}

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
            username: JIRA_API_EMAIL,
            password: JIRA_API_TOKEN,
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
      const issueFields = {
        fields: {
          project: {
            key: projectKey,
          },
          issuetype: {
            name: "Test Execution",
          },
          summary: `${name} Test Execution`,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Created via Tool API",
                  },
                ],
              },
            ],
          },
          priority: {
            name: "Medium",
          },
        },
      };

      /*
      const response = await axios.post(
        `${JIRA_BASE_URL}/rest/api/3/issue`,
        issueFields,
        {
          auth: {
            username: JIRA_API_EMAIL,
            password: JIRA_API_TOKEN,
          },
        }
      );

      */

      const testExecutionKey = "QAP-63733"; //response.data.key;

      /*
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
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Linking test execution to parent issue",
                    },
                  ],
                },
              ],
            },
          },
        };

        await axios.post(`${JIRA_BASE_URL}/rest/api/3/issueLink`, linkPayload, {
          auth: {
            username: JIRA_API_EMAIL,
            password: JIRA_API_TOKEN,
          },
        });
      }
      
      */

      // Add test cases to the test execution
      const testExecUrl = `${JIRA_BASE_URL}/rest/raven/1.0/api/testexec/${testExecutionKey}/test`;
      const addTestCasesResponse = await axios.post(
        testExecUrl,
        { add: testCaseIds },
        {
          auth: {
            username: JIRA_API_EMAIL,
            password: JIRA_API_TOKEN,
          },
        }
      );

      const testExecutionUrl = `${JIRA_BASE_URL}/browse/${testExecutionKey}`;
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
