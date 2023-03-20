import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

function PublicResources() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [allResourrces, setAllResources] = useState([]);
  const [states, setStates] = useState({
    loading: true,
    error: false,
    errMsg: "",
  });

  const [value, setValue] = useState("");
  useEffect(() => {
    const getResources = async () => {
      if (user.superadmin) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_PORT}:3002/resources/public`,
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setStates({ loading: false, error: false });
          setAllResources(res.data);
          console.log(res.data);
        } catch (err) {
          setStates({
            loading: false,
            error: false,
            errMsg: err.response.data.message,
          });
          console.log(err);
        }
      } else {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_PORT}:3002/resources/public`,
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setStates({ loading: false, error: false });
          setAllResources(res.data);
          console.log(res.data);
        } catch (err) {
          setStates({
            loading: false,
            error: false,
            errMsg: err.response.data.message,
          });
          console.log(err);
        }
      }
    };
    getResources();
  }, [user.jwt_token, user.superadmin]);
  //pagination Data
  const countPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(allResourrces.slice(0, countPerPage))
  );

  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        allResourrces
          .filter((item) => item.topic.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [allResourrces]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(allResourrces.slice(from, to)));
    },
    [allResourrces]
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

  const viewResource = (resource) => {
    sessionStorage.setItem("resourceId", resource._id);
    navigate(`/admin/resources/${resource.topic}`);
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
            ) : states.error ? (
              <div>{states.errMsg}</div>
            ) : (
              <>
                {allResourrces?.length === 0 ? (
                  <div>
                    <h1>No resource</h1>
                  </div>
                ) : (
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
                                    src={`${process.env.REACT_APP_PORT}:3002/${resource.avatar}`}
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
                                    onClick={() => viewResource(resource)}
                                    className="hover:text-green_bg px-2 py-1 border-gray_bg bg-[#e9e9e9] rounded-sm "
                                  >
                                    <FaEye />
                                  </button>
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
                            total={allResourrces.length}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p>No resource</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicResources;
