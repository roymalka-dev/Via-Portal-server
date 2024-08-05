import { EndpointType } from "../../types/routes.types";
import { authenticator } from "../../middleware/authenticator";
import { jiraControllers } from "../../controllers/jira.controllers";
import { redisGetRequestCache } from "@/middleware/redis";
export const jiraEndpoints: EndpointType[] = [
  {
    name: "jira-create-test-execution",
    method: "post",
    path: "/create-test-execution",
    controller: jiraControllers.createTestExecution,
    middleware: [],
    authority: "PUBLIC",
  },
];
