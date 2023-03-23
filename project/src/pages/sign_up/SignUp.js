import axios from "axios";
import { useRef, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sign_up.css";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(false);
    try {
      const res = await axios.post(`http://52.47.163.4:3000/users/new`, {
        username: username,
        email: email,
        password: password,
      });
      setLoading(false);
      console.log(res.data);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setErr(true);
      err.response
        ? setErrMsg(err.response.data.errors[0].msg)
        : setErrMsg(err.message);
      console.log(err);
    }
  };

  return (
    <div className="signIn_container">
      <div className="form_container">
        <form className="signIn_form">
          <div className="w-[80%] mx-auto ">
            <img src="/logo.png" alt="logo" />
          </div>
          <div className="w-[80%] mx-auto ">
            <p className="text-2xl font-bold text-green_bg text-center">
              Sign In
            </p>
          </div>
          <div className="input_container">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
              {loading ? (
                <div>
                  <p>Loading...</p>
                </div>
              ) : err ? (
                <div>
                  <div>
                    <p className="text-red-500">{errMsg}</p>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <button
              onClick={(e) => handleSubmit(e)}
              disabled={loading}
              className="text-white"
            >
              Sign Up
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
        <Link to="/" className="link text-[#34c684] hover:text-black">
          Login In
        </Link>
      </div>
      <footer className="mt-[30px] text-center">
        <p>© 2023 KXC INC. FROM KXC INC.</p>
      </footer>
    </div>
  );
}

export default SignUp;
