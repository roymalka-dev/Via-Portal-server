import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const JENKINS_USER = process.env.JENKINS_USER || "";
const JENKINS_TOKEN = process.env.JENKINS_TOKEN || "";
const JENKINS_ISR_URL = process.env.JENKINS_ISR_URL || "";
const CITY_CHECK_JOB_URL = process.env.CITY_CHECK_JOB_SHEET_URL || "";
export const jenkinsServices = {
  cityCheckJob: async (cityId: string, configs: string[]) => {
    const JENKINS_JOB_NAME = "citi-check";
    const JENKINS_JOB_SUB_PATH = "export";

    const configString = configs.join(",");

    const params = new URLSearchParams();
    params.append("cities", cityId);
    params.append("configs", configString);
    params.append("sheet_url", CITY_CHECK_JOB_URL);

    try {
      const response = await axios.post(
        `${JENKINS_ISR_URL}view/arch/job/${JENKINS_JOB_NAME}/job/${JENKINS_JOB_SUB_PATH}/buildWithParameters`,
        params,
        {
          auth: {
            username: JENKINS_USER,
            password: JENKINS_TOKEN,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    } catch (error) {
      console.error("Error triggering Jenkins job:", error);
      throw error;
    }
  },
};
