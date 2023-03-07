import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateInstitues() {
  const { user } = useContext(Context);
  const [instituteName, setInstituteName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(false);
    try {
      const res = await axios.post(
        "http://13.36.208.80:3001/institutes/new",
        {
          name: instituteName,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      console.log(res.data);
      navigate("/admin/institutes");
    } catch (err) {
      setLoading(false);
      setErr(true);
      setErrMsg(err.response.data.message);
      console.log(err);
    }
  };

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="w-[24%]">
        <Sidebar />
      </div>
      <div className="w-[82%]">
        <div>
          <Topbar />
        </div>
        <div className="py-2 px-5">
          <form className="flex flex-col items-center gap-6 bg-white shadow-md w-[80%] mx-auto h-fit pb-5 rounded-md">
            <h1 className="text-[20px] text-center my-2 pb-2 border-b-2 border-b-[#e5e7eb] w-full">
              Create Institute
            </h1>
            <div className="flex flex-col justify-center gap-6">
              <div className="flex gap-3 items-center">
                <p className="w-[30%]">Institues Name: </p>
                <div className="w-[300px] h-[40px]">
                  <input
                    placeholder="Username"
                    className="w-full h-full bg-transparent border-2 border-[#707070] rounded-md px-2"
                    value={instituteName}
                    onChange={(e) => setInstituteName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                {loading ? (
                  <div>
                    <p>Loading...</p>
                  </div>
                ) : err ? (
                  <div>
                    <p>{errMsg}</p>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="flex gap-3 items-center mt-6 justify-between">
                <button
                  onClick={(e) => handleSubmit(e)}
                  className="bg-green-600 h-[40px] w-[35%] py-1 px-3"
                  disabled={loading}
                >
                  <p className="text-white">Submit</p>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateInstitues;
