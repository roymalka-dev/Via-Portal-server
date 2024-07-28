import { shiftControllers } from "@/controllers/shift.controllers";
import { EndpointType } from "../../types/routes.types";
import { authenticator } from "@/middleware/authenticator";

export const shiftEndpoints: EndpointType[] = [
  {
    name: "get-google-calendar-shifts",
    method: "get",
    path: "/get-google-calendar-shifts",
    controller: shiftControllers.getAllCalendarEvents,
    middleware: [],
    authority: "PUBLIC",
  },
];
