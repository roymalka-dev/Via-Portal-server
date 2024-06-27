export const validateUserAuth = (
  endpointAuthority: string,
  userAuthority: string[]
) => {
  if (userAuthority.includes("ADMIN")) {
    return true;
  }

  return userAuthority.includes(endpointAuthority);
};
