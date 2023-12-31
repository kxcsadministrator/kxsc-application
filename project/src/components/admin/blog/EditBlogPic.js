import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";
import API_URL from "../../../Url";

function EditBlogPic({ setEditPicModal, id, blog }) {
  const { user } = useContext(Context);
  const [avatar, setAvatar] = useState(blog?.avatar);
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
        setEditPicModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setEditPicModal]);

  const updatePic = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false, success: false });
    const formData = new FormData();
    formData.append("avatar", avatar);
    try {
      const res = await axios.post(
        `${API_URL.user}/blog/update-avatar/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.jwt_token}`,
          },
        }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setEditPicModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      console.log(err);
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
          Edit Picture
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <form>
            <input
              className="w-[90%] custom-file-input"
              type="file"
              filename={avatar}
              accept="image/*"
              onChange={(e) => {
                setAvatar(e.target.files[0]);
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
                onClick={(e) => updatePic(e)}
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

export default EditBlogPic;
