import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import { useNavigate } from "react-router-dom";

function DeleteResources({
  deleteResource,
  instituteId,
  setDeleteResourceModal,
}) {
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
        setDeleteResourceModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setDeleteResourceModal]);

  const submitDeleteResource = async () => {
    setLoading(true);
    setSuccess(false);
    setErr(false);
    try {
      const res = await axios.delete(
        `http://15.186.62.53:3002/resources/delete/${deleteResource._id}`,
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setDeleteResourceModal(false);
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
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center  pb-2">
          Delete Resources
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <p>Are you sure you want to delete {deleteResource.topic}</p>
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
                onClick={() => setDeleteResourceModal(false)}
                className="bg-green_bg h-[35px] w-full py-1 px-2"
              >
                <p className="text-white">back</p>
              </button>
              <button
                onClick={() => submitDeleteResource()}
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

export default DeleteResources;
