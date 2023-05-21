import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import RequestModal from "../../institutes/requests.js/RequestModal";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import DeleteComment from "./DeleteComment";
import EditComment from "./EditComment";
import API_URL from "../../../../Url";

function Comments({ comments }) {
  //states
  const [text, setText] = useState("");
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const { user } = useContext(Context);
  const [requestModal, setRequestModal] = useState(false);
  const id = sessionStorage.getItem("taskId");
  const [editComModal, setEditComModal] = useState(false);
  const [deleteComModal, setDeleteComModal] = useState(false);
  const [comment, setComment] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false });
    setRequestModal(true);
    try {
      const res = await axios.post(
        `${API_URL.institute}/tasks/${id}/comments/new`,
        {
          author: user.id,
          body: text,
          task_id: id,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      console.log(res.data);
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setRequestModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      setStates({
        loading: false,
        error: true,
        errMsg: err.response.data.message,
        success: false,
      });
    }
  };

  const deleteBtn = (comment) => {
    setComment(comment);
    setDeleteComModal(true);
  };
  const editBtn = (comment) => {
    setComment(comment);
    setEditComModal(true);
  };

  console.log(comments);
  return (
    <div className="flex flex-col gap-5 px-5">
      <form className="flex justify-between items-center">
        <div className="w-[60%]">
          <textarea
            placeholder="Comments"
            className="message_input w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button
          className="p-2 bg-[#52cb83]  md:min-w-[100px] max-w-[128px] text-white rounded-md lg:w-36 w-[35%] text-sm"
          onClick={(e) => handleSubmit(e)}
        >
          Post
        </button>
      </form>
      <div className="dash bg-slate-300" />
      {comments?.length ? (
        <div>
          {comments.map((comment, index) => (
            <div key={index}>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-xs text-gray-400">
                    {comment.date_created}
                  </p>
                  <p className="text-base -mt-2">{comment.body}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 border-gray_bg bg-gray-600 text-white rounded-sm -mt-2"
                    onClick={() => editBtn(comment)}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    className="p-2 border-gray_bg bg-gray-200 text-red-500 rounded-sm -mt-2"
                    onClick={() => deleteBtn(comment)}
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
              <div className="dash" />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No comments</p>
        </div>
      )}
      <div className="relative w-full h-full">
        {requestModal && (
          <RequestModal setRequestModal={setRequestModal} states={states} />
        )}
      </div>
      <div>
        {deleteComModal && (
          <DeleteComment
            comment={comment}
            setDeleteComModal={setDeleteComModal}
          />
        )}
        {editComModal && (
          <EditComment comment={comment} setEditComModal={setEditComModal} />
        )}
      </div>
    </div>
  );
}

export default Comments;
