import * as yup from "yup";

export const userValidationSchemas = {
  bodySchemas: {
    addUser: yup.object().shape({
      firstName: yup
        .string()
        .required("First name is required")
        .min(2, "First name is too short")
        .max(50, "First name is too long"),
      lastName: yup
        .string()
        .required("Last name is required")
        .min(2, "Last name is too short")
        .max(50, "Last name is too long"),
      email: yup.string().email().required("Email is required"),
      authorizations: yup
        .array()
        .of(
          yup
            .string()
            .min(2, "Authorization is too short")
            .max(50, "Authorization is too long")
        )
        .required("Authorizations are required"),
    }),
    editUser: yup.object().shape({
      authorizations: yup
        .array()
        .of(
          yup
            .string()
            .min(2, "Authorization is too short")
            .max(50, "Authorization is too long")
        )
        .required("Authorizations are required"),
      firstName: yup
        .string()
        .required("First name is required")
        .min(3, "First name is too short")
        .max(50, "First name is too long"),
      lastName: yup
        .string()
        .required("Last name is required")
        .min(3, "Last name is too short")
        .max(50, "Last name is too long"),
      email: yup
        .string()
        .email("Email is not valid")
        .required("Last name is required"),
    }),
  },
  paramSchemas: {
    getUserDetails: yup.object().shape({
      id: yup.string().required("ID is required"),
    }),
    editUser: yup.object().shape({
      //id: yup.string().required("ID is required"),
    }),
  },
  querySchemas: {},
};
