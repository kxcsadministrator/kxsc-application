import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import API_URL from "../../../../Url";

function AddTaskModal({ setTaskModal, instituteId }) {
  //states
  const [name, setName] = useState("");
  const { user } = useContext(Context);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });

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
    setStates({ loading: true, error: false });
    try {
      const res = await axios.post(
        `${API_URL.institute}/tasks/new/${instituteId}`,
        {
          name: name,
          author: user._id,
          institute: instituteId,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setTaskModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      setStates({
        loading: false,
        error: true,
        errMsg: err.response.data.message,
        success: false,
      });
    }
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
            {states.loading ? (
              <div>
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : states.error ? (
              <div>
                <p className="text-red-400">{states.errMsg}</p>
              </div>
            ) : states.success ? (
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
                disabled={states.loading}
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
