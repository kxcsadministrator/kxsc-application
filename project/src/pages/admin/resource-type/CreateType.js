import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../Url";

function CreateType() {
  const { user } = useContext(Context);
  const [typeName, setTypeName] = useState("");
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
        `${API_URL.resource}/resources/new-resource-type`,
        {
          name: typeName,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        navigate("/admin/resource-types");
      }, 2000);
    } catch (err) {
      console.log(err);
      setStates({
        loading: false,
        success: false,
        error: true,
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
          <h1 className="form_header">Create Resource Type</h1>
          <div className="institute_input_container">
            <div className="institute_input_row">
              <label> Name: </label>
              <input
                placeholder="Resource Type Name"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
              />
            </div>
            <div>
              {states.loading ? (
                <div>
                  <p>Loading...</p>
                </div>
              ) : states.error ? (
                <div>
                  <p className="text-red-500">{states.errMsg}</p>
                </div>
              ) : states.success ? (
                <div>
                  <p className="text-green-500">success</p>
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

export default CreateType;
