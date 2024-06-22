import * as yup from "yup";

export const executionValidationSchemas = {
  bodySchemas: {
    createExecution: yup.object().shape({
      name: yup
        .string()
        .required("Name is required")
        .min(3, "Name is too short")
        .max(50, "Name is too long"),
      tags: yup
        .array()
        .of(
          yup.string().min(2, "Tag name too short").max(50, "Tag name too long")
        )
        .required("Tags are required"),
    }),
    editExecution: yup.object().shape({
      executionId: yup.string().required("Execution ID is required"),
      itemId: yup.string().required("Item ID is required"),
      newStatus: yup
        .string()
        .required("New status is required")
        .min(3, "Status is too short")
        .max(50, "Status is too long"),
    }),
    editAssignee: yup.object().shape({
      executionId: yup.string().required("Execution ID is required"),
      itemId: yup.string().required("Item ID is required"),
      assignee: yup
        .string()
        .required("Assignee is required")
        .min(3, "Assignee is too short")
        .max(50, "Assignee is too long"),
    }),
  },
  paramSchemas: {
    getExecution: yup.object().shape({
      id: yup.string().required("ID is required"),
    }),
  },
  querySchemas: {},
};
