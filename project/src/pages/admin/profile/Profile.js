import Topbar from "../../../components/admin/Topbar";
import Sidebar from "../../../components/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useContext, useEffect } from "react";
import EditUser from "./EditUser";
import EditPassword from "./EditPassword";
import EditPic from "./EditPic";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import RemovePic from "./RemovePic";
import API_URL from "../../../Url";
import axios from "axios";

function Profile() {
  const { user } = useContext(Context);
  const [editUserModal, setEditUserModal] = useState(false);
  const [editPassModal, setEditPassModal] = useState(false);
  const [editPicModal, setEditPicModal] = useState(false);
  const [removePicModal, setRemovePicModal] = useState(false);
  const [userDetails, setUserDetails] = useState(false);
  const [editUser, setEditUser] = useState();
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });

  //get categories
  useEffect(() => {
    const getUserDetails = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(`${API_URL.user}/users/one/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.jwt_token}`,
          },
        });
        setStates({ loading: false, error: false });
        setUserDetails(res.data);
        console.log(res.data);
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
    getUserDetails();
  }, []);

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

  const fileLink = () => {
    if (userDetails?.profile_picture) {
      const filePath = userDetails.profile_picture?.path;
      return filePath.replace("files/", "");
    }
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
        <div className="py-2 px-4">
          <div className="flex flex-col gap-5 items-center mt-9">
            <div className="flex flex-col gap-4">
              {userDetails?.profile_picture ? (
                <img
                  src={`${API_URL.user}/${fileLink()}`}
                  alt="profile_picture"
                  className="w-[100px] h-[100px] md:w-[180px] md:h-[180px] rounded-full object-cover"
                />
              ) : (
                <img
                  src="/default.png"
                  className="rounded-full md:w-[180px] md:h-[180px] w-[100px] h-[100px] object-cover"
                  alt="default"
                />
              )}

              <div className="flex items-center gap-3 mx-auto">
                {userDetails?.profile_picture && (
                  <button
                    className="p-2 border-gray_bg bg-[#fbe2e2] text-red-500 rounded-sm -mt-2"
                    onClick={() => deletePic()}
                  >
                    <RiDeleteBinLine />
                  </button>
                )}
                <button
                  className="p-2 border-gray_bg bg-[#eeeded] text-gray-600 rounded-sm -mt-2"
                  onClick={() => editPic()}
                >
                  <FaRegEdit />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:text-lg md:-mt-12 w-[90%] md:w-[60%] text-sm md:text-base">
              <div className="flex gap-3 items-center">
                <p className="w-[80%] mt-3">
                  <span className="pr-3">First Name:</span>{" "}
                  {userDetails.first_name}
                </p>
              </div>
              <div className="dash bg-white " />
              <div className="flex gap-3 items-center">
                <p className="w-[80%] mt-3">
                  <span className="pr-3">Last Name:</span>{" "}
                  {userDetails.last_name}
                </p>
              </div>
              <div className="dash bg-white " />
              <div className="flex gap-3 items-center">
                <p className="w-[80%] mt-3">
                  <span className="pr-3">Phone Number:</span>{" "}
                  {userDetails.phone}
                </p>
              </div>
              <div className="dash bg-white " />
              <div className="flex gap-3 items-center">
                <p className="w-[80%] mt-3">
                  <span className="pr-3">Email:</span> {userDetails.email}
                </p>
              </div>
              <div className="dash bg-white " />
              <div className="flex gap-3 items-center">
                <p className="w-[80%]">
                  <span className="pr-3">User Name:</span>
                  {userDetails.username}
                </p>
              </div>
              <div className="dash bg-white -mt-2" />
              <div className="flex justify-between items-center">
                <button
                  className="btn_green border-2 rounded-md w-fit"
                  onClick={() => editBtn(user)}
                >
                  Edit
                </button>
                <button
                  className="btn_green bg-[#656665]  border-2 rounded-md  w-fit"
                  onClick={() => changeBtn(user)}
                >
                  change password
                </button>
              </div>
            </div>
          </div>
        </div>
        {editUserModal && (
          <EditUser
            setEditUserModal={setEditUserModal}
            editUser={editUser}
            userDetails={userDetails}
          />
        )}
        {editPassModal && (
          <EditPassword
            setEditPassModal={setEditPassModal}
            editUser={editUser}
          />
        )}
        {editPicModal && (
          <EditPic
            setEditPicModal={setEditPicModal}
            editUser={editUser}
            userDetails={userDetails}
          />
        )}
        {removePicModal && <RemovePic setRemovePicModal={setRemovePicModal} />}
      </div>
    </div>
  );
}

export default Profile;
