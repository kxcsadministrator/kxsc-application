const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        userPublic: null,
        isFetching: true,
        error: "",
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        userPublic: null,
        isFetching: false,
        error: "",
      };
    case "LOGIN_SUCCESS_PUBLIC":
      return {
        userPublic: action.payload,
        user: null,
        isFetching: false,
        error: "",
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        userPublic: null,
        isFetching: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        userPublic: null,
        isFetching: false,
        error: "",
      };
    default:
      return state;
  }
};

export default Reducer;
