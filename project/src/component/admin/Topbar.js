import { useContext } from "react";
import { FiUsers } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Context } from "../../context/Context";

function Topbar() {
  const { user } = useContext(Context);
  console.log(user);
  return (
    <div className="flex justify-between items-center px-6 h-[70px] bg-white w-full">
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
      <div className="flex gap-3 items-center">
        {user.profile_picture ? (
          <div className="md:w-9 w-7">
            <img
              src={`http://13.36.208.80:3000/uploads/1678629738131-IMG_1234.jpg`}
              alt="profile_picture"
              className="w-full  rounded-full"
            />
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
