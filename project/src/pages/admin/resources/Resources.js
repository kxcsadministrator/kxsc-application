import Topbar from "../../../components/admin/Topbar";
import Sidebar from "../../../components/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import DeleteResources from "../../../components/admin/institutes/resources/DeleteResources";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./resource.css";
import API_URL from "../../../Url";
import Rating from "../../../components/Rating";

function Resources() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [allResources, setAllResources] = useState([]);
  const [deleteResourceModal, setDeleteResourceModal] = useState(false);
  const [deleteResource, setdeleteResource] = useState(false);
  const [states, setStates] = useState({
    loading: true,
    error: false,
    errMsg: "",
  });
  const [value, setValue] = useState("");

  useEffect(() => {
    const getResources = async () => {
      setStates({ loading: true, error: false });
      if (user.superadmin) {
        try {
          const res = await axios.get(`${API_URL.resource}/resources/all`, {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          });
          setStates({ loading: false, error: false });
          setAllResources(res.data);
        } catch (err) {
          setStates({
            loading: false,
            error: true,
            errMsg: err.response.data.message,
          });
        }
      } else {
        try {
          const res = await axios.get(
            `${API_URL.resource}/resources/my-resources`,
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setStates({ loading: false, error: false });
          setAllResources(res.data);
        } catch (err) {
          setStates({
            loading: false,
            err: true,
            errMsg: err.response.data.message,
          });
        }
      }
    };
    getResources();
  }, [user.jwt_token, user.superadmin]);

  //pagination Data
  const countPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(allResources.slice(0, countPerPage))
  );

  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        allResources
          .filter(
            (item) =>
              (item.topic + item.institute.name).toLowerCase().indexOf(query) >
              -1
          )
          .slice(0, 2)
      );

      setCollection(data);
      console.log(data);
    },
    [allResources]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(allResources.slice(from, to)));
    },
    [allResources]
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

  const deleteBtn = (resource) => {
    setdeleteResource(resource);
    setDeleteResourceModal(true);
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
        <div className="py-5 px-4">
          {states.loading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : states.error ? (
            <div>
              <p>{states.errMsg}</p>
            </div>
          ) : allResources.length === 0 ? (
            <div>
              <p>No Resource</p>
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
                              src={`${API_URL.resource}/${resource.avatar}`}
                              alt="avatar resource"
                              className="object-cover h-full w-full"
                            />
                          </div>
                        )}
                        <div className="flex flex-col ">
                          <p className="text-[13px] text-[#c3c3c3]">
                            {resource.institute
                              ? resource.institute.name
                              : "null"}
                          </p>
                          <p className="font-bold text-lg -mt-3">
                            {resource.topic}
                          </p>
                          <p className=" -mt-4 ">
                            By: {resource.author.username}
                          </p>
                          <p className="flex items-center gap-3 text-sm  -mt-2 ">
                            {resource.rating > 0 && (
                              <div className="-mt-4">
                                <Rating rating={resource.rating} />
                              </div>
                            )}
                            <span>Released: {resource.date}</span>
                          </p>
                          <p className="flex gap-1 items-center -mt-1">
                            <button
                              onClick={() => viewResource(resource)}
                              className="hover:text-green_bg px-2 py-1 border-gray_bg bg-[#e9e9e9] rounded-sm "
                            >
                              <FaEye />
                            </button>

                            {/* {user.superadmin && (
                              <button
                                className="px-2 p-1 border-gray_bg bg-[#ffcbcb] rounded-sm text-red-600"
                                onClick={() => deleteBtn(resource)}
                              >
                                <RiDeleteBinLine />
                              </button>
                            )} */}
                          </p>
                        </div>
                      </div>
                      <div className="h-[1.5px] w-full bg-[#cecece] mb-3" />
                    </div>
                  ))}
                  <div className="paginate my-4">
                    {allResources > countPerPage && (
                      <Pagination
                        pageSize={countPerPage}
                        onChange={updatePage}
                        current={currentPage}
                        total={allResources.length}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p>No resource</p>
                </div>
              )}
            </div>
          )}

          {deleteResourceModal && (
            <DeleteResources
              setDeleteResourceModal={setDeleteResourceModal}
              deleteResource={deleteResource}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Resources;
