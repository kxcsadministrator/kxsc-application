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
          `http://13.36.208.80:3000/users/admin-publish-requests`,
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
  const countPerPage = 3;
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
        url: `http://13.36.208.80:3000/users/admin-publish/${id}`,
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
              (
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
                    {collection.map((resource, index) => (
                      <div className="grid gap-6" key={index}>
                        <div className="flex md:flex-row flex-col gap-3 md:h-36 w-full">
                          {resource.avatar === null ? (
                            <div className="md:h-full h-36 md:w-[28%] w-[90%]">
                              <img
                                src="/default.png"
                                alt="default"
                                className="object-cover h-full w-full"
                              />
                            </div>
                          ) : (
                            <div className="h-full w-[28%]">
                              <img
                                src={`http://13.36.208.80:3002/${resource.avatar}`}
                                alt="default"
                                className="object-cover h-full w-full"
                              />
                            </div>
                          )}
                          <div className="flex flex-col ">
                            <p className="text-[13px] text-[#c3c3c3]">
                              {resource.institute.name}
                            </p>
                            <p className="font-bold text-lg -mt-3">
                              {resource.topic}
                            </p>
                            <p className=" -mt-4 ">
                              By: {resource.author.username}
                            </p>
                            <p className="flex items-center gap-3 text-sm  -mt-2 ">
                              <span>
                                {resource.rating === 0
                                  ? "No rating"
                                  : resource.rating + "/5"}
                              </span>
                              <span>Released: {resource.date}</span>
                            </p>
                            <p className="flex gap-1 items-center -mt-1">
                              <button
                                className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
                                onClick={() => publish(resource._id)}
                              >
                                Publish
                              </button>
                              ;
                            </p>
                          </div>
                        </div>
                        <div className="h-[1.5px] w-full bg-[#cecece] mb-3" />
                      </div>
                    ))}
                    <div className="paginate my-4">
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
                    <p>No resource</p>
                  </div>
                )}
              </div>
              )
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
