import { useContext, useEffect, useState, useCallback } from "react";
import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import "./users.css";
import { Context } from "../../../context/Context";
import axios from "axios";
import DeleteModal from "../../../component/admin/users/DeleteModal";
import { RiDeleteBinLine } from "react-icons/ri";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

function Users() {
  //useStates
  const { user } = useContext(Context);
  const [allUsers, setAllUsers] = useState([]);
  const [states, setStates] = useState({
    loading: true,
    error: false,
    errMsg: "",
  });
  const [deleteUser, setDeleteUser] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.get("http://13.36.208.80:3000/users/all", {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setStates({ loading: false, error: false });
        setAllUsers(res.data);
      } catch (err) {
        setStates({
          loading: false,
          error: false,
          errMsg: err.response.data.message,
        });
      }
    };
    getUsers();
  }, [user.jwt_token]);

  //pagination Data
  const countPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(allUsers.slice(0, countPerPage))
  );

  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        allUsers
          .filter((item) => item.username.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [allUsers]
  );

  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(allUsers.slice(from, to)));
    },
    [allUsers]
  );

  //useEffect Search
  useEffect(() => {
    if (!value) {
      updatePage(1);
    } else {
      setCurrentPage(1);
      searchData(value);
    }
  }, [value, updatePage, searchData]);

  const handleDelete = (id, username, email) => {
    setDeleteUser({ id, username, email });
    setDeleteModal(true);
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
          {states.loading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : states.error ? (
            <div>{states.errMsg}</div>
          ) : allUsers.length > 0 ? (
            <div className="container_3">
              <div className="all_heading">
                <h1>All Users</h1>
                <div>
                  <input
                    placeholder="Search Users"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </div>
              {collection.length > 0 ? (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">s/n</th>
                        <th scope="col">Username</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collection?.map((singleUser, index) => (
                        <tr key={singleUser._id}>
                          <td data-label="s/n">{index + 1}</td>
                          <td data-label="Username">{singleUser.username}</td>
                          <td data-label="Action">
                            <div>
                              <button
                                className="user_delete_btn"
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="paginate">
                    <Pagination
                      pageSize={countPerPage}
                      onChange={updatePage}
                      current={currentPage}
                      total={allUsers.length}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p>No user with the search input found</p>
                </div>
              )}

              {deleteModal && (
                <DeleteModal
                  setDeleteModal={setDeleteModal}
                  deleteUser={deleteUser}
                  setDeleteUser={setDeleteUser}
                />
              )}
            </div>
          ) : (
            <div>
              <p>No users Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;
