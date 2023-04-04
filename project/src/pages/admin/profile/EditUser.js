import { useEffect, useRef, useState } from "react";
import axios from "axios";

function EditUser({ setEditUserModal, editUser }) {
  //   states
  const [user, setUser] = useState(editUser.username);
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
        setEditUserModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setEditUserModal]);

  const submitEditUser = async () => {
    setStates({ loading: true, error: false, success: false });
    try {
      const res = await axios.patch(
        `http://13.36.208.34:3000/users/edit-username/${editUser.id}`,
        {
          new_username: user,
        },
        { headers: { Authorization: `Bearer ${editUser.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setEditUserModal(false);
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
          Edit Users
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <form>
            <input
              placeholder={user}
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
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
                onClick={() => submitEditUser()}
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

export default EditUser;
