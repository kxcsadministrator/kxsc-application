import { useContext, useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Context } from "../../context/Context";
import { AiOutlineLogout } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Topbar() {
  const { user, dispatch } = useContext(Context);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [not, setNot] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:3000/messages/notifications/${user.id}`,
      {
        headers: { Authorization: `Bearer ${user.jwt_token}` },
      }
    );

    eventSource.onmessage = (event) => {
      setNot((prevData) => [...prevData, JSON.parse(event.data)]);
    };

    return () => {
      eventSource.close();
    };
  }, [user.id, user.jwt_token]);

  console.log(not);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("search", search);
    navigate("/admin/search");
  };

  const topbarContainer = user.superadmin
    ? "flex justify-between items-center px-6 gap-3 h-[50px] bg-white w-full"
    : "flex justify-end items-center px-6 gap-3 h-[50px] bg-white w-full";
  return (
    <div className={topbarContainer}>
      {user.superadmin && (
        <div>
          <form
            className="flex items-center text-[#454545]"
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              className="bg-[#f4f4f6] w-[250px] h-9 rounded-lg pl-9 pr-3"
              placeholder="Search for resources"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute ml-3">
              <IoIosSearch />
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-4 items-center">
        <div className="profile_img">
          {user.profile_picture ? (
            <div className="md:w-8 w-7 cursor-pointer">
              <img
                src={`http://52.47.163.4:3000/uploads/${user.profile_picture.original_name}`}
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
    </div>
  );
}

export default Topbar;
