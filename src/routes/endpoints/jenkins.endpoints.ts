import { jenkinsControllers } from "../../controllers/jenkins.controllers";
import { EndpointType } from "../../types/routes.types";
import { authenticator } from "../../middleware/authenticator";
export const jenkinsEndpoints: EndpointType[] = [
  {
    name: "jenkins-city-check-job",
    method: "post",
    path: "/city-check-job",
    controller: jenkinsControllers.cityCheckJob,
    middleware: [authenticator],
    authority: "USER",
  },
];
