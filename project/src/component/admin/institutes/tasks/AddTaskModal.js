import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../context/Context";

function AddTaskModal({ setTaskModal, instituteId }) {
  const [name, setName] = useState("");
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  let menuRef = useRef();

  //function removes modal when dom is clicked
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setTaskModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setTaskModal]);

  const submitTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErr(false);
    try {
      const res = await axios.post(
        `http://13.36.208.80:3001/tasks/new/${instituteId}`,
        {
          name: name,
          author: user._id,
          institute: instituteId,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setTaskModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      setSuccess(false);
      setLoading(false);
      setErr(true);
      setErrMsg(err.response.data.message);
      console.log(err);
    }
    console.log(name);
  };
  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="modal_heading">Add Member</h1>
        <div className="flex flex-col items-center w-full gap-3">
          <form>
            <input
              placeholder="Task name"
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </form>
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
                onClick={(e) => submitTask(e)}
                className="bg-green-600 h-[35px] w-full py-1 px-2"
                disabled={loading}
              >
                <p className="text-white">Submit</p>
              </button>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;
