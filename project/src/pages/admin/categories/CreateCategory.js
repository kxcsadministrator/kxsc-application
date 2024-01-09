import React from "react";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import { Context } from "../../../context/Context";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../Url";

function CreateCategory() {
  const { user } = useContext(Context);
  const [cat, setCat] = useState("");
  const [subCat, setSubCat] = useState("");
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
        `${API_URL.resource}/categories/new`,
        {
          name: cat,
          sub_categories: [subCat],
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      navigate("/admin/categories");
    } catch (err) {
      setLoading(false);
      setErr(true);
      setErrMsg(err.response?.data?.errors?.[0] || err.response?.data?.message);
    }
  };

  const navigateCat = () => {
    navigate("/admin/categories");
  };

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>
        <div className="py-2 px-4">
          <form className="flex flex-col items-center gap-6 px-2 bg-white shadow-md w-full md:w-[80%] mx-auto h-fit pb-5 rounded-md">
            <div className="flex justify-between my-3 pb-2 border-b-2 border-b-[#e5e7eb] w-[90%] mx-auto items-center">
              <h1 className="text-[20px]  ">Create Category</h1>
              <button
                className="p-2 bg-[#52cb83]  md:min-w-[100px] max-w-[128px] text-white rounded-md lg:w-36 md:w-[35%] w-fit text-sm"
                onClick={() => navigateCat()}
              >
                Categories
              </button>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div className="flex gap-3 items-center">
                <p className="md:w-[30%] hidden lg:block">Categories: </p>
                <div className="md:w-[300px] h-[30px] md:h-[40px]">
                  <input
                    placeholder="Categories"
                    className="w-full h-full bg-transparent border-2 border-[#707070] rounded-md px-2"
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <p className="md:w-[30%] hidden lg:block">Sub-categories: </p>
                <div className="md:w-[300px]  h-[30px] md:h-[40px]">
                  <input
                    placeholder="Sub-categories"
                    className="w-full h-full bg-transparent border-2 border-[#707070] rounded-md px-2"
                    value={subCat}
                    onChange={(e) => setSubCat(e.target.value)}
                  />
                </div>
              </div>

              <div>
                {loading ? (
                  <div>
                    <p>Loading...</p>
                  </div>
                ) : err ? (
                  <div className="text-red-500">
                    <p>{errMsg}</p>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div>
                <button
                  onClick={(e) => handleSubmit(e)}
                  className="btn_green -mt-3"
                  disabled={loading}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCategory;
