import { authenticator } from "../../middleware/authenticator";
import { scopingControllers } from "../../controllers/scoping.controllers";
import { EndpointType } from "../../types/routes.types";

export const scopingEndpoints: EndpointType[] = [
  {
    name: "create confluence page",
    method: "post",
    path: "/create-confluence-page",
    controller: scopingControllers.createConfluencePage,
    middleware: [authenticator],
    authority: "USER",
  },
  {
    name: "get-city-check-csv",
    method: "post",
    path: "/get-city-check-csv",
    controller: scopingControllers.getCityCheckJobCSV,
    middleware: [authenticator],
    authority: "USER",
  },
  {
    name: "create from template",
    method: "post",
    path: "/create-confluence-from-template",
    controller: scopingControllers.createFromTemplate,
    middleware: [authenticator],
    authority: "USER",
  },
];
