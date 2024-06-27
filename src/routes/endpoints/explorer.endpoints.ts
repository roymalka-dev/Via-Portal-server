import { explorerControllers } from "../../controllers/explorer.controllers";
import { validateRequest } from "../../middleware/validator";
import { EndpointType } from "../../types/routes.types";
import { explorerValidationSchemas } from "../../validations/explorer.validations";

export const explorerEndpoints: EndpointType[] = [
  {
    name: "get root directory",
    method: "get",
    path: "/get-root-directory",
    controller: explorerControllers.getRootDirectory,
    middleware: [
      validateRequest(
        explorerValidationSchemas.querySchemas.getRootDirectory,
        "query"
      ),
    ],
    authority: "USER",
  },
  {
    name: "get directories",
    method: "get",
    path: "/get-directories/:id",
    controller: explorerControllers.getDirectories,
    middleware: [],
    authority: "USER",
  },
  {
    name: "get directory by path",
    method: "get",
    path: "/get-directory-by-path",
    controller: explorerControllers.getDirectoryByPath,
    middleware: [
      validateRequest(
        explorerValidationSchemas.querySchemas.getDirectoryByPath,
        "query"
      ),
    ],
    authority: "USER",
  },
  {
    name: "add directory",
    method: "post",
    path: "/add-directory",
    controller: explorerControllers.addDirectory,
    middleware: [
      validateRequest(
        explorerValidationSchemas.bodySchemas.addDirectory,
        "body"
      ),
    ],
    authority: "ADMIN",
  },
  {
    name: "remove directory",
    method: "delete",
    path: "/remove-directory/:id",
    controller: explorerControllers.removeDirectory,
    middleware: [
      validateRequest(
        explorerValidationSchemas.paramSchemas.removeDirectory,
        "params"
      ),
    ],
    authority: "ADMIN",
  },
  {
    name: "remove file",
    method: "delete",
    path: "/remove-file/:id",
    controller: explorerControllers.removeFile,
    middleware: [
      validateRequest(
        explorerValidationSchemas.paramSchemas.removeFile,
        "params"
      ),
    ],
    authority: "ADMIN",
  },
  {
    name: "edit file name",
    method: "put",
    path: "/edit-file/:id",
    controller: explorerControllers.editFileName,
    middleware: [],
    authority: "ADMIN",
  },
  {
    name: "edit folder name",
    method: "put",
    path: "/edit-folder/:id",
    controller: explorerControllers.editFolderName,
    middleware: [],
    authority: "ADMIN",
  },
  {
    name: "move folder",
    method: "put",
    path: "/move-folder",
    controller: explorerControllers.moveFolder,
    middleware: [],
    authority: "ADMIN",
  },
];
