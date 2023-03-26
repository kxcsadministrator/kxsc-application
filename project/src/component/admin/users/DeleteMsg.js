import { useEffect, useRef, useContext, useState } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
function DeleteMsg({ setDeleteMsgModal, message }) {
  //   states
  const { user } = useContext(Context);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });

  let menuRef = useRef();

  //set modal false
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setDeleteMsgModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setDeleteMsgModal]);

  //remove collab function
  const submitDeleteMsg = async () => {
    setStates({ loading: true, error: false });
    try {
      const res = await axios.delete(
        `http://52.47.163.4:3000/messages/delete/${message._id}`,
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setDeleteMsgModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      setStates({
        loading: false,
        error: true,
        errMsg: err.response.data.errors
          ? err.response.data.errors[0].msg
          : err.response.data.message,
        success: false,
      });
    }
  };
  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center  pb-2">
          Delete collaborator
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-bold">{message.subject}</span>
          </p>
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteMsgModal(false)}
                className="btn_green"
              >
                back
              </button>
              <button
                onClick={() => submitDeleteMsg()}
                className="btn_red"
                disabled={states.loading}
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

export default DeleteMsg;
