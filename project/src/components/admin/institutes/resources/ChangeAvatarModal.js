import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import API_URL from "../../../../Url";

function ChangeAvatarModal({ setChangeAvatarModal, resource }) {
  const [avatar, setAvatar] = useState("");
  const { user } = useContext(Context);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setChangeAvatarModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setChangeAvatarModal]);

  let menuRef = useRef();

  const submitAvatar = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false });
    const formData = new FormData();
    formData.append("avatar", avatar);
    try {
      const res = await axios.post(
        `${API_URL.resource}/resources/update-avatar/${resource.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.jwt_token}`,
          },
        }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setChangeAvatarModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      setStates({
        loading: false,
        error: true,
        errMsg: err.response.data.errors
          ? err.response.data.errors[0].msg
          : err.response.data.message,
      });
    }
  };

  console.log(resource);
  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="modal_heading">Change Resource Avatar</h1>
        <div className="flex flex-col items-center w-full gap-3">
          <form>
            <div className="flex gap-3 w-full items-center">
              <label for="img">Select Avatar:</label>
              <input
                className="custom-file-input"
                placeholder="Upload Avatar"
                type="file"
                id="img"
                name="img"
                accept="image/*"
                filename={avatar}
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </div>
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
                onClick={(e) => submitAvatar(e)}
                className="btn_green w-fit text-white"
                disabled={states.loading}
              >
                Submit
              </button>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default ChangeAvatarModal;
