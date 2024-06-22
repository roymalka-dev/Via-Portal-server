import * as yup from "yup";

export const explorerValidationSchemas = {
  bodySchemas: {
    addDirectory: yup.object().shape({
      name: yup
        .string()
        .required("Name is required")
        .min(3, "Name is too short")
        .max(50, "Name is too long"),
      parentFolderId: yup.string().required("Parent folder ID is required"),
    }),
  },
  paramSchemas: {
    removeDirectory: yup.object().shape({
      id: yup.string().required("ID is required"),
    }),
    removeFile: yup.object().shape({
      id: yup.string().required("ID is required"),
    }),
  },
  querySchemas: {
    getRootDirectory: yup.object().shape({
      name: yup.string().required("Name is required"),
    }),
    getDirectoryByPath: yup.object().shape({
      path: yup.string().required("Path is required"),
    }),
  },
};
