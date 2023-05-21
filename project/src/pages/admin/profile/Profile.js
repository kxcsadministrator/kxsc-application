import Topbar from "../../../components/admin/Topbar";
import Sidebar from "../../../components/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useContext } from "react";
import EditUser from "./EditUser";
import EditPassword from "./EditPassword";
import EditPic from "./EditPic";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import RemovePic from "./RemovePic";
import API_URL from "../../../Url";

function Profile() {
  const { user } = useContext(Context);
  const [editUserModal, setEditUserModal] = useState(false);
  const [editPassModal, setEditPassModal] = useState(false);
  const [editPicModal, setEditPicModal] = useState(false);
  const [removePicModal, setRemovePicModal] = useState(false);
  const [editUser, setEditUser] = useState();

  const editBtn = (user) => {
    setEditUser(user);
    setEditUserModal(true);
  };

  const changeBtn = (user) => {
    setEditUser(user);
    setEditPassModal(true);
  };

  const editPic = (user) => {
    setEditUser(user);
    setEditPicModal(true);
  };

  const deletePic = (user) => {
    setRemovePicModal(true);
  };
  console.log(user);

  return (
    <div className="base_container">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>
        <div className="py-2 px-4">
          <div className="flex md:flex-row flex-col gap-5 items-center mt-9">
            <div className="md:w-[25%] w-[90%] flex flex-col gap-5">
              {user?.profile_picture ? (
                <img
                  src={`${API_URL.user}/${user.profile_picture.path}`}
                  alt="profile_picture"
                  className="w-full object-cover h-[200px] rounded-md"
                />
              ) : (
                <img src="/default.png" className="rounded-md" alt="default" />
              )}

              <div className="flex items-center gap-3">
                <button
                  className="p-2 border-gray_bg bg-gray-600 text-white rounded-sm -mt-2"
                  onClick={() => editPic()}
                >
                  <FaRegEdit />
                </button>
                <button
                  className="p-2 border-gray_bg bg-gray-200 text-red-500 rounded-sm -mt-2"
                  onClick={() => deletePic()}
                >
                  <RiDeleteBinLine />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-lg md:-mt-12 w-[90%] md:w-fit text-sm md:text-base">
              <div className="flex gap-3 items-center">
                <p className="w-[80%] mt-3">
                  <span className="pr-3">username:</span> {user.username}
                </p>
                <div>
                  <button
                    className="btn_green border-2 rounded-md w-fit"
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
              <button
                className="btn_green border-2 rounded-md  w-fit"
                onClick={() => changeBtn(user)}
              >
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
        {editPicModal && (
          <EditPic setEditPicModal={setEditPicModal} editUser={editUser} />
        )}
        {removePicModal && <RemovePic setRemovePicModal={setRemovePicModal} />}
      </div>
    </div>
  );
}

export default Profile;
