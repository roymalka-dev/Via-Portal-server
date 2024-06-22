export const validateUserAuth = (
  endpointAuthority: string,
  userAuthority: string[]
) => {
  //console.log("endpointAuthority: ", endpointAuthority);
  //console.log("userAuthority: ", userAuthority);

  if (userAuthority.includes("ADMIN")) {
    return true;
  }

  return userAuthority.includes(endpointAuthority);
};
