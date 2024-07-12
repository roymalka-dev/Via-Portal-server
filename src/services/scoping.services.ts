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
        username: "itsroymalka@icloud.com",
        password: process.env.CONFLUENCE_API_TOKEN || "",
      },
    };

    try {
      const response = await axios.post(
        "https://itsroymalka.atlassian.net/wiki/rest/api/content",
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
    } catch (error: any) {
      throw new Error(`Error getting city data: ${error}`);
    }
  },
};
