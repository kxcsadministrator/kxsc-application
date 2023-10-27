import { createContext, useEffect, useReducer } from "react";
import Reducer from "./Reducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  userPublic: JSON.parse(localStorage.getItem("userPublic")) || null,
  isFetching: false,
  error: false,
};

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  useEffect(() => {
    const isLoggedIn = state.user && state.user?.jwt_token;
    const tokenExpiration = state.user?.tokenExpiration;

    const isLoggedPublicIn = state.userPublic?.jwt_token;
    const tokenExpirationPublic = state.userPublic?.tokenExpirationPublic;

    if (isLoggedIn && Date.now() >= tokenExpiration) {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      localStorage.removeItem("userPublic");
    }

    if (isLoggedPublicIn && Date.now() >= tokenExpirationPublic) {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      localStorage.removeItem("userPublic");
    }

    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("userPublic", JSON.stringify(state.userPublic));
  }, [state.user, state.userPublic]);

  return (
    <Context.Provider
      value={{
        user: state.user,
        userPublic: state.userPublic,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
