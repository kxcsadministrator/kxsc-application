import axios from "axios";
import { useRef, useContext, useState } from "react";
import "./reset.css";

function ResetEmail() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(false);
    try {
      const res = await axios.post(
        `http://52.47.163.4:3000/users/reset-password-request`,
        {
          username: username,
        }
      );
      setLoading(false);
      console.log(res.data);
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
    <div>
      <div className="reset_container">
        <div className="form_container">
          <form className="reset_form">
            <div className="w-[80%] mx-auto ">
              <img src="/logo.png" alt="logo" />
            </div>
            <div className="w-[80%] mx-auto ">
              <p className="text-2xl font-bold text-green_bg text-center">
                Enter Email
              </p>
            </div>
            <div className="input_container">
              <input
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                Submit
              </button>
            </div>
          </form>
        </div>
        <footer className="mt-[30px] text-center">
          <p>© 2023 KXC INC. FROM KXC INC.</p>
        </footer>
      </div>
    </div>
  );
}

export default ResetEmail;
