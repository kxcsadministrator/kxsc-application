import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import { Context } from "../../../context/Context";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const { user } = useContext(Context);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (superAdmin) {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.post(
          `http://13.36.208.34:3000/users/new/super-admin`,
          {
            username: username,
            email: email,
            password: password,
          },
          { headers: { Authorization: `Bearer ${user.jwt_token}` } }
        );
        setStates({ loading: false, error: false });
        navigate("/admin/users");
      } catch (err) {
        setStates({
          loading: false,
          error: false,
          errMsg: err.response.data.message,
        });
      }
    } else {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.post(`http://13.36.208.34:3000/users/new`, {
          username: username,
          email: email,
          password: password,
        });
        setStates({ loading: false, error: false });
        navigate("/admin/users");
      } catch (err) {
        setStates({
          loading: false,
          error: false,
          errMsg: err.response.data.message,
        });
      }
    }
  };
  return (
    <div className="base_container">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>

        <form className="user_form">
          <h1 className="form_header">Create User</h1>
          <div className="user_input_container">
            <div className="user_input_row">
              <label>Username: </label>
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="user_input_row">
              <label>Email: </label>
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="user_input_row">
              <label>Password: </label>
              <input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              {states.loading ? (
                <div>
                  <p>Loading...</p>
                </div>
              ) : states.err ? (
                <div>
                  {states.errMsg.map((msg) => (
                    <div key={msg.param}>
                      <p>{msg.msg}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="form_button_btn">
              <button
                onClick={(e) => handleSubmit(e)}
                className="user_submit_button"
                disabled={states.loading}
              >
                Submit
              </button>
              {user.superadmin && (
                <div className="flex items-start gap-3">
                  <div>
                    <input
                      type="checkbox"
                      name="superAdmin"
                      onChange={(e) => setSuperAdmin(e.target.checked)}
                    />
                  </div>
                  <p>Make Super Admin</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
