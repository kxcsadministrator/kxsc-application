import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useContext } from "react";
import axios from "axios";
import EditUser from "./EditUser";
import EditPassword from "./EditPassword";

function Profile() {
  const { user } = useContext(Context);
  const [editUserModal, setEditUserModal] = useState(false);
  const [editPassModal, setEditPassModal] = useState(false);
  const [editUser, setEditUser] = useState();

  const editBtn = (user) => {
    setEditUser(user);
    setEditUserModal(true);
  };

  const changeBtn = (user) => {
    setEditUser(user);
    setEditPassModal(true);
  };

  return (
    <div className="base_container">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>
        <div className="py-2 px-5">
          <div className="flex gap-5 items-center mt-9">
            <div className="w-[22%]">
              <img src="/default.png" className="rounded-md" alt="default" />
            </div>
            <div className="flex flex-col gap-2 text-lg">
              <div className="flex gap-3 items-center">
                <p className="w-[80%] mt-3">
                  <span className="pr-3">username:</span> {user.username}
                </p>
                <div>
                  <button
                    className="btn_green w-fit"
                    onClick={() => editBtn(user)}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div className="dash bg-white " />
              <div className="flex gap-3 items-center">
                <p className="w-[80%]">
                  <span className="pr-3">Email:</span>
                  {user.email}
                </p>
              </div>
              <div className="dash bg-white -mt-2" />
              <button className="btn_green" onClick={() => changeBtn(user)}>
                change password
              </button>
            </div>
          </div>
        </div>
        {editUserModal && (
          <EditUser setEditUserModal={setEditUserModal} editUser={editUser} />
        )}
        {editPassModal && (
          <EditPassword
            setEditPassModal={setEditPassModal}
            editUser={editUser}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
