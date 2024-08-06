import { authenticator } from "../../middleware/authenticator";
import { loggerControllers } from "../../controllers/logger.controllers";
import { EndpointType } from "../../types/routes.types";

export const loggerEndpoints: EndpointType[] = [
  {
    name: "get logs by date",
    method: "get",
    path: "/get-logs",
    controller: loggerControllers.getLogsByDate,
    middleware: [authenticator],
    authority: "ADMIN",
  },
];
