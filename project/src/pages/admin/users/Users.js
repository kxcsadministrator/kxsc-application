import { useContext, useEffect, useState } from "react";
import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import "./users.css";
import { Context } from "../../../context/Context";
import axios from "axios";
import { Link } from "react-router-dom";
import DeleteModal from "../../../component/admin/users/DeleteModal";
import EditModal from "../../../component/admin/users/EditModal";
import { RiDeleteBinLine } from "react-icons/ri";

function Users() {
  const { user } = useContext(Context);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [deleteUser, setDeleteUser] = useState({});
  const [editUser, setEditUser] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("http://13.36.208.80:3000/users/all", {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setLoading(false);
        setError(false);
        setAllUsers(res.data);
        console.log(res.data);
      } catch (err) {
        setLoading(false);
        setError(true);
        setErrMsg(err.response.data.message);
      }
    };
    getUsers();
  }, [user.jwt_token]);

  const handleDelete = (id, username, email) => {
    setDeleteUser({ id, username, email });
    setDeleteModal(true);
  };
  const handleEdit = (id, username, email) => {
    setEditUser({ id, username, email });
    setEditModal(true);
  };
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
          ) : (
            <>
              <div>
                <h1 className="text-center my-3">All Users</h1>
                <table className="bg-white rounded-md shadow-md ">
                  <thead>
                    <tr>
                      <th scope="col">s/n</th>
                      <th scope="col">Username</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((singleUser, index) => (
                      <tr key={singleUser._id}>
                        <td>{index + 1}</td>
                        <td>{singleUser.username}</td>
                        <td>
                          {user.superadmin ? (
                            <div className="flex gap-4 items-center justify-center">
                              <button
                                className="p-2 border-gray_bg bg-gray_bg rounded-sm text-red-600"
                                onClick={() =>
                                  handleDelete(
                                    singleUser._id,
                                    singleUser.username,
                                    singleUser.email
                                  )
                                }
                              >
                                <RiDeleteBinLine size="1.2rem" />
                              </button>
                            </div>
                          ) : (
                            <p>Only super Admin can edit Users</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="relative w-full h-full">
                {deleteModal && (
                  <DeleteModal
                    setDeleteModal={setDeleteModal}
                    deleteUser={deleteUser}
                    setDeleteUser={setDeleteUser}
                  />
                )}
                {editModal && (
                  <EditModal
                    setEditModal={setEditModal}
                    editUser={editUser}
                    setEditUser={setEditUser}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;
