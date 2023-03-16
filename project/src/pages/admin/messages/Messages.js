import { useContext, useEffect, useState } from "react";
import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import axios from "axios";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";

function Messages() {
  const { user } = useContext(Context);
  const [allMsg, setAllMsg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("http://13.36.208.80:3000/messages/all", {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setLoading(false);
        setError(false);
        setAllMsg(res.data);
        console.log(res.data);
      } catch (err) {
        setLoading(false);
        setError(true);
        setErrMsg(err.response.data.message);
      }
    };
    getUsers();
  }, [user.jwt_token]);

  const handleDelete = () => {};

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>
        <div className="py-2 px-5">
          {loading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : error ? (
            <div>{errMsg}</div>
          ) : allMsg?.length ? (
            <div>
              <h1 className="text-center my-3">All Users</h1>
              <table className="bg-white rounded-md shadow-md ">
                <thead>
                  <tr>
                    <th scope="col">s/n</th>
                    <th scope="col">Messages</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allMsg.map((msg, index) => (
                    <tr key={msg._id}>
                      <td>{index + 1}</td>
                      <td>{msg}</td>
                      <td>
                        {user.superadmin ? (
                          <div className="flex gap-4 items-center justify-center">
                            <button
                              className="p-2 border-gray_bg bg-gray_bg rounded-sm text-red-600"
                              onClick={() => handleDelete()}
                            >
                              <RiDeleteBinLine size="1.2rem" />
                            </button>
                          </div>
                        ) : (
                          <p></p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <p> No messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
