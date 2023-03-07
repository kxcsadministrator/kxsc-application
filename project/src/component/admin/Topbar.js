import { useContext } from "react";
import { FiUsers } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Context } from "../../context/Context";

function Topbar() {
  const { user } = useContext(Context);
  return (
    <div className="flex justify-between items-center px-4 h-[70px] bg-white">
      <div>
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
      <div className="flex gap-3">
        {user.profile_picture ? (
          <div>
            <img src={user.profile_picture} alt="profile_picture" />
          </div>
        ) : (
          <div>
            <FiUsers />
          </div>
        )}

        <div>
          <IoIosNotificationsOutline />
        </div>
      </div>
    </div>
  );
}

export default Topbar;
