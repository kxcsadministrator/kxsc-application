import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../context/Context";
function DeleteInstituteModal({ setDeleteInstituteModal, modalInstitute }) {
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
        setDeleteInstituteModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setDeleteInstituteModal]);

  const submitInstitute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErr(false);
    try {
      const res = await axios.delete(
        `http://15.186.62.53:3001/institutes/delete/${modalInstitute._id}`,
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setDeleteInstituteModal(false);
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
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="modal_heading">Delete Institute</h1>
        <div className="flex flex-col items-center w-full gap-3">
          <div>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{modalInstitute.name}</span>
            </p>
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteInstituteModal(false)}
                className="bg-green-600 h-[35px] w-full py-1 px-2"
              >
                <p className="text-white">back</p>
              </button>
              <button
                onClick={(e) => submitInstitute(e)}
                className="bg-[#d14949] h-[35px] w-full py-1 px-2"
                disabled={loading}
              >
                <p className="text-white">continue</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteInstituteModal;
