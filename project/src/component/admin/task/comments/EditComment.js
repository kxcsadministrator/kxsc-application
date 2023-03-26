import { useEffect, useRef, useContext, useState } from "react";
import { Context } from "../../../../context/Context";
import axios from "axios";

function EditComment({ setEditComModal, comment }) {
  //   states
  const { user } = useContext(Context);
  const [editComment, setEditComment] = useState(comment.body);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const id = sessionStorage.getItem("taskId");
  let menuRef = useRef();

  //set modal false
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setEditComModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setEditComModal]);

  //remove collab function
  const submitEditComment = async () => {
    setStates({ loading: true, error: false, success: false });
    try {
      const res = await axios.patch(
        `http://52.47.163.4:3001/tasks/comments/edit/${comment._id}`,
        {
          body: editComment,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setEditComModal(false);
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
          Edit collaborator
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <form>
            <input
              placeholder={comment}
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={editComment}
              onChange={(e) => {
                setEditComment(e.target.value);
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
                onClick={() => submitEditComment()}
                className="btn_green"
                disabled={states.loading}
              >
                submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditComment;
