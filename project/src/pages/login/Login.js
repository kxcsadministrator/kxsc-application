import axios from "axios";
import { useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import "./login.css";

function Login() {
  const userRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { dispatch, isFetching, error } = useContext(Context);
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("http://13.36.208.80:3000/users/login", {
        username: userRef.current.value,
        password: passwordRef.current.value,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      console.log(res.data);
      navigate("/admin");
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response ? err.response.data.errors[0].msg : err.message,
      });
    }
  };

  return (
    <div className="login_container">
      <div className="form_container">
        <form className="login_form" onSubmit={handleSubmit}>
          <div className="bg-gray-400 rounded-md h-[60px] w-[80%] mx-auto p-1 mt-3 mb-4">
            <h5 className="text-white">KXC Inc.</h5>
          </div>
          <div className="input_container">
            <input placeholder="Username" ref={userRef} type="text" />
            <input placeholder="password" ref={passwordRef} type="password" />
            {error && <p>{error}</p>}
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
            <Link to="/" className="link text-center text-gray-400">
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
      <footer className="mt-[60px] text-center">
        <p>© 2023 KXC INC. FROM KXC INC.</p>
      </footer>
    </div>
  );
}

export default Login;
