import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";
import API_URL from "../../../Url";

function DeleteCategory({ setDeleteCatModal, deleteCat }) {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setDeleteCatModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setDeleteCatModal]);

  const submitCat = async () => {
    setLoading(true);
    setSuccess(false);
    setErr(false);
    try {
      const res = await axios.delete(
        `${API_URL.resource}/categories/delete/${deleteCat._id}`,
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setDeleteCatModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      setSuccess(false);
      setLoading(false);
      setErr(true);
      setErrMsg(
        err.response.data.errors
          ? err.response.data.errors[0].msg
          : err.response.data.message
      );
    }
  };
  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="modal_heading">Delete Category</h1>
        <div className="flex flex-col items-center w-full gap-3">
          <div>
            <p>
              Are you sure you want to delete
              <span className="font-bold ml-2">{deleteCat.name}</span>
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
                onClick={() => setDeleteCatModal(false)}
                className="bg-green_bg rounded-sm h-[35px] w-full py-1 px-2 text-white"
              >
                back
              </button>
              <button
                onClick={() => submitCat()}
                className="bg-[#d14949] rounded-sm h-[35px] w-full py-1 px-2 text-white"
                disabled={loading}
              >
                continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteCategory;
