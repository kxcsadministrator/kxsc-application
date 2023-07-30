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
    const isLoggedIn = state.user && state.user.token;
    const tokenExpiration = state.user && state.user.tokenExpiration;

    const isLoggedPublicIn = state.userPublic && state.userPublic.token;
    const tokenExpirationPublic =
      state.userPublic && state.userPublic.tokenExpirationPublic;

    if (isLoggedIn && tokenExpiration && Date.now() >= tokenExpiration) {
      dispatch({ type: "LOGOUT" });
    }

    if (
      isLoggedPublicIn &&
      tokenExpirationPublic &&
      Date.now() >= tokenExpirationPublic
    ) {
      dispatch({ type: "LOGOUT" });
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
