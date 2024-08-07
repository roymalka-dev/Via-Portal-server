import { RouteType } from "../types/routes.types";
import { checklistEndpoints } from "./endpoints/checklist.endpoints";
import { explorerEndpoints } from "./endpoints/explorer.endpoints";
import { executionEndpoints } from "./endpoints/execution.endpoint";
import { authenticator } from "../middleware/authenticator";
import { userEndpoints } from "./endpoints/user.endpoints";
import { loggerEndpoints } from "./endpoints/logger.endpoints";
import { scopingEndpoints } from "./endpoints/scoping.endpoints";
import { shiftEndpoints } from "./endpoints/shift.endpoints";
import { jenkinsEndpoints } from "./endpoints/jenkins.endpoints";
import { jiraEndpoints } from "./endpoints/jira.endpoints";

export const routes: RouteType[] = [
  {
    name: "checklist",
    path: "/checklist",
    endpoints: checklistEndpoints,
    middleware: [authenticator],
  },
  {
    name: "execution",
    path: "/execution",
    endpoints: executionEndpoints,
    middleware: [authenticator],
  },
  {
    name: "explorer",
    path: "/explorer",
    endpoints: explorerEndpoints,
    middleware: [authenticator],
  },
  {
    name: "user",
    path: "/user",
    endpoints: userEndpoints,
    middleware: [authenticator],
  },
  {
    name: "logger",
    path: "/logger",
    endpoints: loggerEndpoints,
    middleware: [authenticator],
  },
  {
    name: "scoping",
    path: "/scoping",
    endpoints: scopingEndpoints,
    middleware: [],
  },
  {
    name: "shift",
    path: "/shift",
    endpoints: shiftEndpoints,
    middleware: [],
  },
  {
    name: "jenkins",
    path: "/jenkins",
    endpoints: jenkinsEndpoints,
    middleware: [],
  },
  {
    name: "jira",
    path: "/jira",
    endpoints: jiraEndpoints,
    middleware: [],
  },
];
