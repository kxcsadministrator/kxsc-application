import { useEffect, useRef, useState } from "react";
import axios from "axios";
import API_URL from "../../../Url";

function EditPublicPassword({ setEditPassModal, editUser }) {
  //   states
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
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
        setEditPassModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setEditPassModal]);

  const submitEditPass = async () => {
    setStates({ loading: true, error: false, success: false });
    try {
      const res = await axios.patch(
        `${API_URL.user}/users/public/change-password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        { headers: { Authorization: `Bearer ${editUser.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setEditPassModal(false);
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
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center pb-2">
          Edit Password
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <form className="flex flex-col gap-4">
            <input
              placeholder="Old Password"
              type="password"
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
            />
            <input
              placeholder="New Password"
              type="password"
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
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
                onClick={() => submitEditPass()}
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

export default EditPublicPassword;
