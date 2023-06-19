import { useEffect, useRef, useState } from "react";
import axios from "axios";
import API_URL from "../../../Url";

function EditPublicUser({ setEditUserModal, userDetails, editUser }) {
  //   states
  const [firstName, setFirstName] = useState(userDetails.first_name);
  const [lastName, setLastName] = useState(userDetails.last_name);
  const [email, setEmail] = useState(userDetails.email);
  const [phone, setPhone] = useState(userDetails.phone);
  const [username, setUsername] = useState(userDetails.username);
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
        `${API_URL.user}/users/public/update/${editUser.id}`,
        {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          email: email,
          username: username,
        },
        { headers: { Authorization: `Bearer ${editUser.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setEditUserModal(false);
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
      console.log(err);
    }
  };

  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center  pb-2">
          Edit Users
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <form className="flex flex-col gap-2">
            <input
              placeholder={firstName}
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              placeholder={lastName}
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <input
              placeholder={email}
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              placeholder={phone}
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
            <input
              placeholder={username}
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
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

export default EditPublicUser;
