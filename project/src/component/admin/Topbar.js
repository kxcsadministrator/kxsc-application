import { useContext } from "react";
import { FiUsers } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Context } from "../../context/Context";
import { AiOutlineLogout } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

function Topbar() {
  const { user, dispatch } = useContext(Context);
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };
  return (
    <div className="flex justify-end items-center px-6 gap-3 h-[50px] bg-white w-full">
      {/*   <div>
   <form className="flex items-center text-[#454545]">
          <input
            className="bg-[#f4f4f6] w-[250px] h-9 rounded-lg pl-9 pr-3"
            placeholder="Search for resources"
          />
          <div className="absolute ml-3">
            <IoIosSearch />
          </div>
        </form>
      </div>
      */}
      <div className="text-gray-600">
        <BiSearchAlt size="1.4rem" />
      </div>

      <div className="profile_img">
        {user.profile_picture ? (
          <div className="md:w-8 w-7 cursor-pointer">
            <img
              src={`http://13.36.208.80:3000/uploads/1678629738131-IMG_1234.jpg`}
              alt="profile_picture"
              className="w-full  rounded-full"
            />
          </div>
        ) : (
          <div className="cursor-pointer">
            <FiUsers />
          </div>
        )}
        <div className="hover_div">
          <div
            className="content_1 text-black hover:text-green_bg cursor-pointers"
            onClick={() => logout()}
          >
            <AiOutlineLogout />
            <h5>Log Out</h5>
          </div>
        </div>
      </div>
      <div className="text-gray-600">
        <IoIosNotificationsOutline size="1.4rem" />
      </div>
    </div>
  );
}

export default Topbar;
