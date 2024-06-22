import { userControllers } from "@/controllers/user.controllers"; // Make sure the path is correct
import { validateRequest } from "@/middleware/validator";
import { EndpointType } from "@/types/routes.types";
import { userValidationSchemas } from "@/validations/user.validations";

export const userEndpoints: EndpointType[] = [
  {
    name: "get user details",
    method: "get",
    path: "/get-user-details/",
    controller: userControllers.getUserDetails,
    middleware: [],
    authority: "USER",
  },
  {
    name: "get all users",
    method: "get",
    path: "/get-all-users/",
    controller: userControllers.getAllUsers,
    middleware: [],
    authority: "ADMIN",
  },
  {
    name: "get all users as assingees",
    method: "get",
    path: "/get-all-assingees",
    controller: userControllers.getAllUsersAsAssignees,
    middleware: [],
    authority: "USER",
  },

  {
    name: "edit user",
    method: "put",
    path: "/edit-user",
    controller: userControllers.editUser,
    middleware: [
      validateRequest(userValidationSchemas.bodySchemas.editUser, "body"),
    ],
    authority: "ADMIN",
  },
  {
    name: "logout",
    method: "post",
    path: "/logout",
    controller: userControllers.logout,
    middleware: [],
    authority: "USER",
  },
  {
    name: "verify",
    method: "get",
    path: "/verify",
    controller: userControllers.verify,
    middleware: [],
    authority: "USER",
  },
];
