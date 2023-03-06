import { useEffect, useRef, useContext, usestate, useState } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";

function EditModal({ setEditModal, editUser, setEditUser }) {
  const [username, setUsername] = useState(editUser.username);
  const [email, setEmail] = useState(editUser.email);
  const { user } = useContext(Context);
  let menuRef = useRef();
  //function removes modal when dom is clicked
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setEditModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setEditModal]);

  const handleBackBtn = () => {
    setEditModal(false);
  };
  const handleSubmit = async (e) => {};
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[rgba(5,2,9,0.6)]">
      <div
        className="flex flex-col items-center py-2 gap-3 w-[35%] mx-auto h-[40vh] bg-white rounded-md shadow-md border-gray-500 border-2"
        ref={menuRef}
      >
        <h1 className="font-bold text-[20px] text-red-500 border-b-2 border-b-gray w-full text-center  pb-2">
          EDIT USER
        </h1>
        <form className="flex flex-col gap-2">
          <div className="flex gap-5">
            <label>Username :</label>
            <input
              className=" bg-transparent border-2 border-[#707070] rounded-md px-2 h-[35px] w-[40%]"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="flex gap-5">
            <label>Email :</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              className="py-1 px-3 bg-green-600 rounded-sm"
              onClick={() => handleBackBtn()}
            >
              <p>Back</p>
            </button>
            <button
              className="py-1 px-3 bg-red-600 rounded-sm"
              onClick={() => handleSubmit()}
            >
              <p>submit</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
