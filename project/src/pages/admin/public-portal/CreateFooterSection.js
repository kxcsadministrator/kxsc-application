import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";

import { useNavigate } from "react-router-dom";

function CreateFooterSection() {
  const { user } = useContext(Context);
  const [sectionName, setSectionName] = useState("");
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false });
    try {
      const res = await axios.post(
        `http://15.188.62.53:3000/pages/new-section`,
        {
          name: sectionName,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false });
      navigate("/admin/");
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
          <h1 className="form_header">Create Section</h1>
          <div className="institute_input_container">
            <div className="institute_input_row">
              <label>Section Name: </label>
              <input
                placeholder="Section Name"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
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
                className="btn_green"
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

export default CreateFooterSection;
