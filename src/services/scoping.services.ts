import axios from "axios";
import { google } from "googleapis";
export const scopingServices = {
  async createConfluencePage(
    title: string,
    parentPageId: number,
    spaceKey: string,
    content: string
  ): Promise<any> {
    const data = {
      type: "page",
      title: title,
      ancestors: [{ id: parentPageId }],
      space: { key: spaceKey },
      body: {
        storage: {
          value: content,
          representation: "storage",
        },
      },
    };

    const config = {
      auth: {
        username:
          process.env.NODE_ENV === "DEV"
            ? "itsroymalka@icloud.com"
            : "roy.malka@ridewithvia.com",
        password:
          process.env.NODE_ENV === "DEV"
            ? process.env.CONFLUENCE_API_TOKEN_DEV || ""
            : process.env.CONFLUENCE_API_TOKEN_PROD || "",
      },
    };

    try {
      const response = await axios.post(
        process.env.NODE_ENV === "DEV"
          ? "https://itsroymalka.atlassian.net/wiki/rest/api/content"
          : "https://ridewithvia.atlassian.net/wiki/rest/api/content",
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error creating Confluence page: ${error}`);
    }
  },
  getCityData: async (id: string): Promise<any> => {
    try {
      const response = await axios.get(
        `https://via-explorer-api.roymalka.dev/api/v1/public/get-city-data/`
      );
      return response;
    } catch (error: any) {
      throw new Error(`Error getting city data: ${error}`);
    }
  },
  getCityCheckJobCSV: async (cityId: string): Promise<any> => {
    const sheetId = process.env.CITY_CHECK_JOB_SHEET_ID || "";
    const apiKey = process.env.GOOGLE_API_KEY || "";

    const arrayToCSV = (data: any[][]): string => {
      const escapeValue = (value: any): string => {
        if (typeof value === "string") {
          // Escape quotes by doubling them
          value = value.replace(/"/g, '""');
          // If the value contains a comma, line break, or double-quote, enclose it in double quotes
          if (value.search(/("|,|\n)/g) >= 0) {
            value = `"${value}"`;
          }
        }
        return value;
      };

      return data.map((row) => row.map(escapeValue).join(",")).join("\n");
    };

    const sheets = google.sheets({
      version: "v4",
      auth: apiKey,
    });

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${cityId}-`,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log("No data found.");
        return;
      }

      const csvData = arrayToCSV(rows);
      return csvData;
    } catch (error) {
      console.error("Error fetching tab data:", error);
      throw error;
    }
  },
  async createFromTemplate(
    templatePageId: number,
    newPageTitle: string,
    parentPageId: number,
    spaceKey: string,
    placeholders: { [key: string]: string }
  ): Promise<any> {
    const config = {
      auth: {
        username:
          process.env.NODE_ENV === "DEV"
            ? "itsroymalka@icloud.com"
            : "roy.malka@ridewithvia.com",
        password:
          process.env.NODE_ENV === "DEV"
            ? process.env.CONFLUENCE_API_TOKEN_DEV || ""
            : process.env.CONFLUENCE_API_TOKEN_PROD || "",
      },
    };

    try {
      // Fetch the template content
      const templateResponse = await axios.get(
        process.env.NODE_ENV === "DEV"
          ? `https://itsroymalka.atlassian.net/wiki/rest/api/content/${templatePageId}?expand=body.storage`
          : `https://ridewithvia.atlassian.net/wiki/rest/api/content/${templatePageId}?expand=body.storage`,
        config
      );
      let templateContent = templateResponse.data.body.storage.value;

      // Replace placeholders with actual content
      Object.keys(placeholders).forEach((key) => {
        const placeholder = `{{${key}}}`;
        const value = placeholders[key];
        templateContent = templateContent.replace(
          new RegExp(placeholder, "g"),
          value
        );
      });

      // Create a new page with the modified content
      const newPageData = {
        type: "page",
        title: newPageTitle,
        ancestors: [{ id: parentPageId }],
        space: { key: spaceKey },
        body: {
          storage: {
            value: templateContent,
            representation: "storage",
          },
        },
      };

      const newPageResponse = await axios.post(
        process.env.NODE_ENV === "DEV"
          ? "https://itsroymalka.atlassian.net/wiki/rest/api/content"
          : "https://ridewithvia.atlassian.net/wiki/rest/api/content",
        newPageData,
        config
      );

      return newPageResponse.data;
    } catch (error) {
      throw new Error(`Error creating page from template: ${error}`);
    }
  },
};
