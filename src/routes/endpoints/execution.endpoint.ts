import { executionControllers } from "../../controllers/execution.controllers";
import { validateRequest } from "../../middleware/validator";
import { EndpointType } from "../../types/routes.types";
import { executionValidationSchemas } from "../../validations/execution.validations";

export const executionEndpoints: EndpointType[] = [
  {
    name: "create-execution",
    method: "post",
    path: "/create-execution",
    controller: executionControllers.createExecution,
    middleware: [
      validateRequest(
        executionValidationSchemas.bodySchemas.createExecution,
        "body"
      ),
    ],
    authority: "ADMIN",
  },
  {
    name: "get-execution",
    method: "get",
    path: "/get-execution/:id",
    controller: executionControllers.getExecution,
    middleware: [
      validateRequest(
        executionValidationSchemas.paramSchemas.getExecution,
        "params"
      ),
    ],
    authority: "USER",
  },
  {
    name: "get-edit-execution-items",
    method: "get",
    path: "/get-edit-execution-items/:id",
    controller: executionControllers.getEditExecutionItems,
    middleware: [],
    authority: "ADMIN",
  },
  {
    name: "add-item-to-execution",
    method: "post",
    path: "/add-item-to-execution",
    controller: executionControllers.addItemToExecution,
    middleware: [
      validateRequest(
        executionValidationSchemas.bodySchemas.addItemToExecution,
        "body"
      ),
    ],
    authority: "ADMIN",
  },
  {
    name: "remove-item-from-execution",
    method: "post",
    path: "/remove-item-from-execution",
    controller: executionControllers.removeItemFromExecution,
    middleware: [
      validateRequest(
        executionValidationSchemas.bodySchemas.removeItemFromExecution,
        "body"
      ),
    ],
    authority: "ADMIN",
  },
];
