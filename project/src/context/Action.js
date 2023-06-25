export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginSuccessPublic = (userPublic) => ({
  type: "LOGIN_SUCCESS",
  payload: userPublic,
});

export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const Logout = () => ({
  type: "LOGOUT",
});
