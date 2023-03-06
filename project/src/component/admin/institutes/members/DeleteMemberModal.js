import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import { useNavigate } from "react-router-dom";

function DeleteMemberModal({ member, setDeleteModal, instituteId }) {
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
        setDeleteModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setDeleteModal]);

  const submitDeleteMember = async () => {
    setLoading(true);
    setSuccess(false);
    setErr(false);
    try {
      const res = await axios.patch(
        `http://35.181.43.119:3001/institutes/remove-members/${instituteId}`,
        {
          members: [member],
        },
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
      console.log(err);
    }
  };
  console.log(member);
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[rgba(5,2,9,0.6)]">
      <div
        className="flex flex-col items-center py-2 gap-3 w-[35%] mx-auto h-fit pb-5 bg-white rounded-md shadow-md border-gray-500 border-2"
        ref={menuRef}
      >
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center  pb-2">
          Add Member
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <p>Are you sure you want to delete {member}</p>
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
                onClick={() => setDeleteModal(false)}
                className="bg-green-600 h-[35px] w-full py-1 px-2"
              >
                <p className="text-white">back</p>
              </button>
              <button
                onClick={() => submitDeleteMember()}
                className="bg-[#d14949] h-[35px] w-full py-1 px-2"
                disabled={loading}
              >
                <p className="text-white">continue</p>
              </button>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default DeleteMemberModal;
