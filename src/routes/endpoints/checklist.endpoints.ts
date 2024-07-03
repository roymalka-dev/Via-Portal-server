import { checklistControllers } from "../../controllers/checklist.controllers";
import { validateRequest } from "../../middleware/validator";
import { EndpointType } from "../../types/routes.types";
import { checklistValidationSchemas } from "../../validations/checklist.validations";

/**
 * Endpoints related to checklist within the application.
 *
 * @type {EndpointType[]} appEndpoints
 */
export const checklistEndpoints: EndpointType[] = [
  {
    name: "get-all-items",
    method: "get",
    path: "/get-all-items",
    controller: checklistControllers.getAllItems,
    middleware: [],
    authority: "USER",
  },
  {
    name: "add-item",
    method: "post",
    path: "/add-item",
    controller: checklistControllers.addItem,
    middleware: [
      validateRequest(checklistValidationSchemas.bodySchemas.addItem, "body"),
    ],
    authority: "ADMIN",
  },
  {
    name: "import-items",
    method: "post",
    path: "/import-items",
    controller: checklistControllers.importItems,
    middleware: [
      validateRequest(
        checklistValidationSchemas.bodySchemas.importItems,
        "body"
      ),
    ],
    authority: "ADMIN",
  },

  {
    name: "edit-item",
    method: "put",
    path: "/edit-item/:id",
    controller: checklistControllers.editItem,
    middleware: [
      validateRequest(checklistValidationSchemas.bodySchemas.editItem, "body"),
    ],
    authority: "ADMIN",
  },
  {
    name: "delete-item",
    method: "delete",
    path: "/delete-item/:id",
    controller: checklistControllers.removeItem,
    middleware: [
      validateRequest(
        checklistValidationSchemas.paramSchemas.removeItem,
        "params"
      ),
    ],
    authority: "ADMIN",
  },
  {
    name: "add-items-from-json",
    method: "post",
    path: "/add-items-from-json",
    controller: checklistControllers.addItemsFromJson,
    middleware: [],
    authority: "ADMIN",
  },
  {
    name: "get-all-tags",
    method: "get",
    path: "/get-all-tags",
    controller: checklistControllers.getAllChecklistTags,
    middleware: [],
    authority: "USER",
  },
  {
    name: "edit-tag",
    method: "post",
    path: "/edit-tag",
    controller: checklistControllers.editTag,
    middleware: [],
    authority: "ADMIN",
  },
  {
    name: "add-tag",
    method: "post",
    path: "/add-tag",
    controller: checklistControllers.addTag,
    middleware: [],
    authority: "ADMIN",
  },
  {
    name: "delete-tag",
    method: "delete",
    path: "/delete-tag/:id",
    controller: checklistControllers.deleteTag,
    middleware: [],
    authority: "ADMIN",
  },
];
