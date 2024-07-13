import axios from "axios";

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
        process.env.NODE_ENV
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
};
