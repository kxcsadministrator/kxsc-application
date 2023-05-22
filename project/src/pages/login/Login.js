import axios from "axios";
import { useRef, useContext, React, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../../context/Context";
import "./login.css";
import API_URL from "../../Url";

function Login() {
  const userRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch, isFetching, error } = useContext(Context);
  const [fromLandingPage, setFromLandingPage] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("from") === "landing") {
      setFromLandingPage(true);
    }
  }, [fromLandingPage, location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(`${API_URL.user}/users/login`, {
        username: userRef.current.value,
        password: passwordRef.current.value,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      if (fromLandingPage) {
        navigate("/");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response.data.errors
          ? err.response.data.errors[0].msg
          : err.response.data.message,
      });
    }
  };

  return (
    <div className="login_container">
      <div className="form_container">
        <form className="login_form" onSubmit={handleSubmit}>
          <div className="w-[80%] mx-auto ">
            <img src="/logo.png" alt="logo" />
          </div>
          <div className="w-[80%] mx-auto ">
            <p className="text-2xl font-bold text-green_bg text-center">
              Log In
            </p>
          </div>
          <div className="input_container">
            <input placeholder="Username" ref={userRef} type="text" />
            <input placeholder="password" ref={passwordRef} type="password" />
            {error && <p className="text-red-400">{error}</p>}
            <button type="submit" disabled={isFetching}>
              Login
            </button>
          </div>
          <div className="flex separator items-center">
            <span></span>
            <div className="or">OR</div>
            <span></span>
          </div>
          <p className="text-center text-sm">
            <Link
              to="/admin/forgot-password"
              className="link text-center text-gray-400 hover:text-green_bg"
            >
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
      <div className="sign_container">
        <p>Don't have an account? </p>
        <Link to="/sign_up" className="link text-[#34c684] hover:text-black">
          Sign Up
        </Link>
      </div>
      <footer className="mt-[30px] text-center">
        <p>© 2023 KXC INC. FROM KXC INC.</p>
      </footer>
    </div>
  );
}

export default Login;
