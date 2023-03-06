import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import { useNavigate } from "react-router-dom";

function MakeAdminModal({ setAdminModal, instituteId }) {
  const [username, setUsername] = useState("");
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setAdminModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setAdminModal]);

  const submitAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErr(false);
    try {
      const res = await axios.patch(
        `http://13.36.208.80:3001/institutes/add-admins/${instituteId}`,
        { admins: [username] },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setAdminModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      setSuccess(false);
      setLoading(false);
      setErr(true);
      setErrMsg(err.response.data.message);
      console.log(err);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[rgba(5,2,9,0.6)]">
      <div
        className="flex flex-col items-center py-2 gap-3 w-[35%] mx-auto h-fit pb-5 bg-white rounded-md shadow-md border-gray-500 border-2"
        ref={menuRef}
      >
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center  pb-2">
          Make Admin
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <div>
            <input
              placeholder="Username"
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div>
            {loading ? (
              <div>
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : err ? (
              <div>
                <p className="text-red-400">{errMsg}</p>
              </div>
            ) : success ? (
              <div>
                <p className="text-green-400">Success</p>
              </div>
            ) : (
              <div></div>
            )}
            <div>
              <button
                onClick={(e) => submitAdmin(e)}
                className="bg-green-600 h-[35px] w-full py-1 px-2"
                disabled={loading}
              >
                <p className="text-white">Make Admin</p>
              </button>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default MakeAdminModal;
