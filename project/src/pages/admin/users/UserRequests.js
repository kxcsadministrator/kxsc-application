import { useContext, useEffect, useState, useCallback } from "react";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import "./users.css";
import { Context } from "../../../context/Context";
import axios from "axios";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import RequestModalR from "../../../components/admin/institutes/resources/RequestModalR";
import API_URL from "../../../url";

function UserRequests() {
  const { user } = useContext(Context);
  const [allUsers, setAllUsers] = useState([]);
  const [states, setStates] = useState({
    loading: true,
    error: false,
    errMsg: "",
    success: false,
  });
  const [requestModal, setRequestModal] = useState(false);
  const [value, setValue] = useState("");
  useEffect(() => {
    const getUsers = async () => {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.get(`${API_URL.user}/users/new-user-requests`, {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setStates({ loading: false, error: false });
        setAllUsers(res.data);
      } catch (err) {
        setStates({
          loading: false,
          error: false,
          errMsg: err.response.data.errors
            ? err.response.data.errors[0].msg
            : err.response.data.message,
        });
      }
    };
    getUsers();
  }, [user.jwt_token]);

  //pagination Data
  const countPerPage = 50;
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

  const acceptUser = async (id) => {
    setStates({ loading: true, error: false, success: false });
    setRequestModal(true);
    try {
      const res = await axios({
        method: "post",
        url: `${API_URL.user}/users/approve-user-request/${id}`,
        headers: { Authorization: `Bearer ${user.jwt_token}` },
      });
      console.log(res.data);
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setRequestModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      setStates({
        loading: false,
        error: true,
        errMsg: err.response.data.errors
          ? err.response.data.errors[0].msg
          : err.response.data.message,
      });
    }
  };

  return (
    <div>
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
                          <th scope="col">Email</th>
                          <th scope="col">Requester</th>
                          <th scope="col">Institute</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collection?.map((request, index) => (
                          <tr key={request._id}>
                            <td data-label="s/n">{index + 1}</td>
                            <td data-label="Username">{request.username}</td>
                            <td data-label="Email">{request.email}</td>
                            <td data-label="Requester">
                              {request.requester.username}
                            </td>
                            <td data-label="Institute">
                              {request.institute.name}
                            </td>
                            <td>
                              <button
                                className="btn_green"
                                onClick={() => acceptUser(request._id)}
                              >
                                Accept
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="paginate">
                      {allUsers.length > 50 && (
                        <Pagination
                          pageSize={countPerPage}
                          onChange={updatePage}
                          current={currentPage}
                          total={allUsers.length}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>No user with the search input found</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>No user Requests</p>
              </div>
            )}
            {requestModal && (
              <RequestModalR
                setRequestModal={setRequestModal}
                states={states}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRequests;
