import * as yup from "yup";

export const checklistValidationSchemas = {
  bodySchemas: {
    addItem: yup.object().shape({
      name: yup
        .string()
        .required("Name is required")
        .min(3, "Name is too short")
        .max(50, "Name is too long"),
      description: yup
        .string()
        .required("Description is required")
        .min(3, "Description is too short")
        .max(256, "Description is too long"),
      url: yup.string().url().required("URL is required"),
      tags: yup
        .array()
        .of(
          yup.string().min(2, "Tag name too short").max(50, "Tag name too long")
        )
        .required("Tags are required"),
    }),
    editItem: yup.object().shape({
      id: yup.string().required("ID is required"),
      name: yup
        .string()
        .required("Name is required")
        .min(3, "Name is too short")
        .max(50, "Name is too long"),
      description: yup
        .string()
        .required("Description is required")
        .min(3, "Description is too short")
        .max(256, "Description is too long"),
      url: yup.string().url().required("URL is required"),
      tags: yup
        .array()
        .of(
          yup.string().min(2, "Tag name too short").max(50, "Tag name too long")
        )
        .required("Tags are required"),
    }),
  },
  paramSchemas: {
    removeItem: yup.object().shape({
      id: yup.string().required("ID is required"),
    }),
  },
  querySchemas: {},
};
