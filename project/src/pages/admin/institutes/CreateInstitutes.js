import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateInstitues() {
  const { user } = useContext(Context);
  const [instituteName, setInstituteName] = useState("");
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false });
    try {
      const res = await axios.post(
        `http://52.47.163.4:3001/institutes/new`,
        {
          name: instituteName,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false });
      navigate("/admin/institutes");
    } catch (err) {
      setStates({
        loading: false,
        error: false,
        errMsg: err.response.data.message,
      });
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
        <form className="institute_form">
          <h1 className="form_header">Create Institute</h1>
          <div className="institute_input_container">
            <div className="institute_input_row">
              <label>Institues Name: </label>
              <input
                placeholder="Username"
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
              />
            </div>
            <div>
              {states.loading ? (
                <div>
                  <p>Loading...</p>
                </div>
              ) : states.err ? (
                <div>
                  <p>{states.errMsg}</p>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="form_button_btn">
              <button
                onClick={(e) => handleSubmit(e)}
                className="institute_submit_button"
                disabled={states.loading}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateInstitues;
