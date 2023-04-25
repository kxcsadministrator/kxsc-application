import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./reset.css";

function ResetEmail() {
  const [username, setUsername] = useState("");
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false, success: false });
    try {
      const res = await axios.post(
        `http://15.188.62.53:3000/users/reset-password-request`,
        {
          username: username,
        }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setStates({
        loading: false,
        error: true,
        errMsg: err.response.data.errors
          ? err.response.data.errors[0].msg
          : err.response.data.message,
      });
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
                {states.loading ? (
                  <div>
                    <p>Loading...</p>
                  </div>
                ) : states.error ? (
                  <div>
                    <div>
                      <p className="text-red-500">{states.errMsg}</p>
                    </div>
                  </div>
                ) : states.success ? (
                  <div className="text-green-400">
                    <p>Sucess</p>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <button
                onClick={(e) => handleSubmit(e)}
                disabled={states.loading}
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
