import { scopingControllers } from "../../controllers/scoping.controllers";
import { EndpointType } from "../../types/routes.types";

export const scopingEndpoints: EndpointType[] = [
  {
    name: "create confluence page",
    method: "post",
    path: "/create-confluence-page",
    controller: scopingControllers.createConfluencePage,
    middleware: [],
    authority: "PUBLIC",
  },
];
