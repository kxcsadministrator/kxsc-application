import { useContext, useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Context } from "../../context/Context";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Topbar() {
  const { user, dispatch } = useContext(Context);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [not, setNot] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(
      `http://15.186.62.53:3000/messages/notifications/${user.id}`,
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

  console.log(not[0]?.new_user_requests);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("search", search);
    navigate("/admin/search");
  };

  const deleteNot = async () => {
    try {
      const res = await axios({
        method: "delete",
        url: `http://15.186.62.53:3000/messages/notifications`,
        headers: { Authorization: `Bearer ${user.jwt_token}` },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const topbarContainer = user.superadmin
    ? "flex justify-between items-center md:w-[100%] px-4 mx-auto gap-3 h-[50px] bg-white w-full"
    : "flex justify-end items-center md:w-[100%] px-4 mx-auto  gap-3 h-[50px] bg-white w-full";
  return (
    <div className={topbarContainer}>
      {user.superadmin && (
        <div>
          <form
            className="flex items-center text-[#454545]"
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              className="bg-[#f4f4f6] w-[150px] md:w-[250px] h-8 md:h-9 rounded-lg pl-9 pr-3 md:text-base text-sm"
              placeholder="Search"
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
            <div className="md:w-8 w-6 cursor-pointer">
              <img
                src={`http://15.186.62.53:3000/${user.profile_picture.path}`}
                alt="profile_picture"
                className="w-full  rounded-full"
              />
            </div>
          ) : (
            <div className="cursor-pointer">
              <FiUsers size="1.6rem" />
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
        <div className="not">
          <div className="not_icon" onClick={() => deleteNot()}>
            {(not[0]?.publish_requests > 0 ||
              not[0]?.new_user_requests > 0 ||
              not[0]?.messages > 0) && (
              <div className="absolute w-[15px] h-[15px] rounded-full bg-red-500 text-white right-0 overflow-hidden">
                <p className="text-[8px] mt-[0.5px] text-center">
                  {not[0].publish_requests +
                    not[0].new_user_requests +
                    not[0].messages}
                </p>
              </div>
            )}
            <IoIosNotificationsOutline size="1.6rem" />
          </div>
          {(not[0]?.publish_requests > 0 ||
            not[0]?.new_user_requests > 0 ||
            not[0]?.messages > 0) && (
            <div className="notMsg">
              {not[0].messages > 0 && (
                <Link
                  className="link"
                  to="/admin/messages"
                  onClick={() => deleteNot()}
                >
                  you have {not[0].messages} new messages
                </Link>
              )}
              {not[0].requests > 0 && (
                <Link
                  className="link"
                  to="/admin/resources/pending"
                  onClick={() => deleteNot()}
                >
                  you have {not[0].public_requests} new resource request
                </Link>
              )}
              {not[0].new_user_requests > 0 && (
                <Link
                  className="link"
                  to="/admin/user_requests"
                  onClick={() => deleteNot()}
                >
                  you have {not[0].new_user_requests} new user request
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
