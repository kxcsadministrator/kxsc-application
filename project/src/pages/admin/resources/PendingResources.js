import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";
import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import RequestModalR from "../../../component/admin/institutes/resources/RequestModalR";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

function PendingResources() {
  const { user } = useContext(Context);
  const [pendingResources, setPendingResources] = useState([]);

  //request Modal
  const [states, setStates] = useState({
    loading: true,
    error: false,
    errMsg: "",
    success: false,
  });
  const [requestModal, setRequestModal] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const getRequest = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_PORT}:3000/users/admin-publish-requests`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        console.log(res.data);
        setPendingResources(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRequest();
  }, [user.jwt_token]);
  //pagination Data
  const countPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(pendingResources.slice(0, countPerPage))
  );

  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        pendingResources
          .filter((item) => item.topic.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [pendingResources]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(pendingResources.slice(from, to)));
    },
    [pendingResources]
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

  const publish = async (id) => {
    setStates({ loading: true, error: false });
    setRequestModal(true);
    try {
      const res = await axios({
        method: "post",
        url: `${process.env.REACT_APP_PORT}:3000/users/admin-publish/${id}`,
        headers: { Authorization: `Bearer ${user.jwt_token}` },
      });
      console.log(res.data);
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setRequestModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      setStates({
        loading: false,
        error: false,
        errMsg: err.response.data.message,
      });
      console.log(err.data);
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

        <div className="py-2 px-5">
          {pendingResources?.length === 0 ? (
            <div>
              <h1>No pending Resources</h1>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-8">
                <div className="all_heading">
                  <h1>All Resources</h1>
                  <div>
                    <input
                      placeholder="Search Resources"
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
                          <th scope="col">Resource Topic</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collection.map((resource, index) => (
                          <tr key={resource._id}>
                            <td data-label="s/n">{index + 1}</td>
                            <td data-label="Topic">
                              {resource.resource.topic}
                            </td>
                            <td data-label="Action">
                              <div>
                                <button
                                  className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
                                  onClick={() => publish(resource.resource._id)}
                                >
                                  Publish
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
                        total={pendingResources.length}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>No user with the search input found</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="relative w-full h-full">
          {requestModal && (
            <RequestModalR setRequestModal={setRequestModal} states={states} />
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingResources;
