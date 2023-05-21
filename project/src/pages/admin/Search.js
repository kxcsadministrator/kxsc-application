import Topbar from "../../components/admin/Topbar";
import Sidebar from "../../components/admin/Sidebar";
import { Context } from "../../context/Context";
import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import DeleteResources from "../../components/admin/institutes/resources/DeleteResources";
import { RiDeleteBinLine } from "react-icons/ri";
import DeleteInstituteModal from "../../components/admin/institutes/DeleteInstituteModal";
import DeleteModal from "../../components/admin/users/DeleteModal";
import API_URL from "../../Url";

function Search() {
  // search states
  const { user } = useContext(Context);
  const search = sessionStorage.getItem("search");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  //resources states
  const [deleteResourceModal, setDeleteResourceModal] = useState(false);
  const [deleteResource, setdeleteResource] = useState(false);
  //institute states
  const [deleteInstituteModal, setDeleteInstituteModal] = useState(false);
  const [modalInstitute, setModalInstitute] = useState([]);
  //users states
  const [deleteUser, setDeleteUser] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [states, setStates] = useState({
    loading: true,
    error: false,
    errMsg: "",
  });

  useEffect(() => {
    const getData = async () => {
      setStates({ loading: true, error: false });
      if (user.superadmin) {
        try {
          const res = await axios.get(
            `${API_URL.user}/users/superadmin-search?q=${search}`,
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setData(res.data);
          setUsers(res.data.user_results?.slice(0, countPerPage));
          setResources(res.data.resources?.slice(0, countPerPage));
          setInstitutes(res.data.institutes?.slice(0, countPerPage));
          setStates({ loading: false, error: false });
          console.log(res.data);
        } catch (err) {
          console.log(err);
          setStates({
            loading: false,
            error: false,
            errMsg: err.response.data.message,
          });
        }
      }
    };
    getData();
  }, [search, user.jwt_token, user.superadmin]);

  //Data for pagination tables
  const countPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(
    cloneDeep(data.user_results?.slice(0, countPerPage))
  );
  const [resources, setResources] = useState(
    cloneDeep(data[0]?.slice(0, countPerPage))
  );
  const [institutes, setInstitutes] = useState(
    cloneDeep(data[1]?.slice(0, countPerPage))
  );

  //update resource page
  const updatePage_1 = (p) => {
    setCurrentPage(p);
    const to = countPerPage * p;
    const from = to - countPerPage;
    setResources(cloneDeep(data.resources.slice(from, to)));
  };

  //update page for institute
  const updatePage_2 = (p) => {
    setCurrentPage(p);
    const to = countPerPage * p;
    const from = to - countPerPage;
    setInstitutes(cloneDeep(data.institutes.slice(from, to)));
  };

  //update page for users
  const updatePage_3 = (p) => {
    setCurrentPage(p);
    const to = countPerPage * p;
    const from = to - countPerPage;
    setUsers(cloneDeep(data.user_results.slice(from, to)));
  };

  //view resource
  const viewResource = (resource) => {
    sessionStorage.setItem("resourceId", resource._id);
    navigate(`/admin/resources/${resource.topic}`);
  };

  //delete resource
  const deleteBtn = (resource) => {
    setdeleteResource(resource);
    setDeleteResourceModal(true);
  };

  //view Institute
  const viewInstitute = (institute) => {
    sessionStorage.setItem("id", institute._id);
    navigate(`/admin/institutes/${institute.name}`);
  };

  //delete institute
  const deleteBtn_2 = (institute) => {
    setModalInstitute(institute);
    setDeleteInstituteModal(true);
  };

  //delete user
  const handleDelete = (id, username, email) => {
    setDeleteUser({ id, username, email });
    setDeleteModal(true);
  };

  console.log(users);

  return (
    <div className="base_container">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>
        <div className="py-2 mt-20 px-5">
          {data?.resources?.length ||
          data?.institutes?.length ||
          data?.user_results?.length ? (
            <div className="grid gap-4">
              {data.resources.length ? (
                <div>
                  {resources.map((resource, index) => (
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
                            {user.superadmin && (
                              <button
                                className="px-2 p-1 border-gray_bg bg-[#ffcbcb] rounded-sm text-red-600"
                                onClick={() => deleteBtn(resource)}
                              >
                                <RiDeleteBinLine />
                              </button>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="h-[1.5px] w-full bg-[#cecece] mb-3" />
                    </div>
                  ))}
                  <div className="paginate my-4">
                    <Pagination
                      pageSize={countPerPage}
                      onChange={updatePage_1}
                      current={currentPage}
                      total={data.resources.length}
                    />
                  </div>
                  {deleteResourceModal && (
                    <DeleteResources
                      setDeleteResourceModal={setDeleteResourceModal}
                      deleteResource={deleteResource}
                    />
                  )}
                </div>
              ) : (
                <div>
                  <p>No resource with this name</p>
                </div>
              )}

              {institutes.length ? (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">s/n</th>
                        <th scope="col">Institute</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {institutes.map((institute, index) => (
                        <tr key={index}>
                          <td data-label="s/n">{index + 1}</td>
                          <td data-label="Institute">{institute.name}</td>
                          <td data-label="Action">
                            <div className="flex gap-3 items-center md:justify-center justify-end">
                              <button
                                onClick={() => viewInstitute(institute)}
                                className="hover:text-green_bg p-2 border-gray_bg bg-gray_bg rounded-sm"
                              >
                                <FaEye size="1.2rem" />
                              </button>
                              {user.superadmin && (
                                <button
                                  className="p-2 border-gray_bg bg-gray_bg rounded-sm text-red-600"
                                  onClick={() => deleteBtn_2(institute)}
                                >
                                  <RiDeleteBinLine size="1.2rem" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="paginate ">
                    <Pagination
                      pageSize={countPerPage}
                      onChange={updatePage_2}
                      current={currentPage}
                      total={data.institutes.length}
                    />
                  </div>
                  {DeleteInstituteModal && (
                    <DeleteInstituteModal
                      setDeleteInstituteModal={setDeleteInstituteModal}
                      modalInstitute={modalInstitute}
                    />
                  )}
                </div>
              ) : (
                <div>
                  <p>No Institute Found</p>
                </div>
              )}

              {users.length ? (
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
                      {users?.map((singleUser, index) => (
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
                      onChange={updatePage_3}
                      current={currentPage}
                      total={data.user_results.length}
                    />
                  </div>
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
          ) : (
            <div>
              Sorry no resource or institute or user found with this name
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
