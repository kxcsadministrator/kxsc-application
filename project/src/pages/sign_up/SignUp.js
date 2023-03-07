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
      const res = await axios.post("http://13.36.208.80:3000/users/new", {
        username: username,
        email: email,
        password: password,
      });
      setLoading(false);
      console.log(res.data);
      navigate("/login");
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
          <div className=" rounded-md flex justify-center items-center py-2">
            <h5 className="text-green_bg text-2xl">Sign Up</h5>
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
        </form>
      </div>
    </div>
  );
}

export default SignUp;
