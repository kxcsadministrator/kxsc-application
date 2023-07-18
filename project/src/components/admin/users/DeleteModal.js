import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../Url";

function DeleteModal({ setDeleteModal, deleteUser, setDeleteUser }) {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  let menuRef = useRef();
  //function removes modal when dom is clicked
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setDeleteModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setDeleteModal]);

  const handleBackBtn = () => {
    setDeleteModal(false);
  };
  const handleContinueBtn = async () => {
    setLoading(true);
    setSuccess(false);
    setErr(false);
    try {
      const res = await axios.delete(
        `${API_URL.user}/users/delete/${deleteUser.id}`,
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setDeleteModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      setSuccess(false);
      setLoading(false);
      setErr(true);
      setErrMsg(err.response.data.message);
    }
  };
  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="font-bold text-[20px] text-red-500 border-b-2 border-b-gray w-full text-center  py-2 pb-2">
          Are you sure you want to delete this user
        </h1>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 flex-wrap">
            <p>User Id :</p>
            <p>{deleteUser.id}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <p>Username:</p>
            <p>{deleteUser.username}</p>
          </div>
          <div>
            {loading ? (
              <div>
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : err ? (
              <div>
                <p className="text-red-700">{errMsg}</p>
              </div>
            ) : success ? (
              <div>
                <p className="text-green-400">Success</p>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="flex gap-3 mt-4 justify-between">
            <button
              className="py-1 px-3 btn_green rounded-sm"
              onClick={() => handleBackBtn()}
            >
              Back
            </button>
            <button
              className="py-1 px-3 btn_red rounded-sm"
              onClick={() => handleContinueBtn()}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
