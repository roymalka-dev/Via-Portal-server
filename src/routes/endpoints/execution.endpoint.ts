import { executionControllers } from "@/controllers/execution.controllers";
import { validateRequest } from "@/middleware/validator";
import { EndpointType } from "@/types/routes.types";
import { executionValidationSchemas } from "@/validations/execution.validations";

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
];
