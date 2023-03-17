import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteInstituteModal from "../../../component/admin/institutes/DeleteInstituteModal";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

function Institutes() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [allInstitutes, setAllInstitutes] = useState([]);
  const [states, setStates] = useState({
    loading: true,
    error: false,
    errMsg: "",
  });
  const [modalInstitute, setModalInstitute] = useState([]);
  const [deleteInstituteModal, setDeleteInstituteModal] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const getInstitutes = async () => {
      setStates({ loading: true, error: false });
      if (user.superadmin) {
        try {
          const res = await axios.get(
            "http://13.36.208.80:3001/institutes/all",
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setAllInstitutes(res.data);
          setStates({ loading: false, error: false });
          console.log(res.data);
        } catch (err) {
          setStates({
            loading: false,
            error: false,
            errMsg: err.response.data.message,
          });
        }
      } else {
        try {
          const res = await axios.get(
            "http://13.36.208.80:3001/institutes/my-institutes",
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setStates({ loading: false, error: false });
          setAllInstitutes(res.data);
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
    getInstitutes();
  }, [user.jwt_token]);
  //pagination Data
  const countPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(allInstitutes.slice(0, countPerPage))
  );

  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        allInstitutes
          .filter((item) => item.name.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [allInstitutes]
  );

  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(allInstitutes.slice(from, to)));
    },
    [allInstitutes]
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

  const viewInstitute = (institute) => {
    sessionStorage.setItem("id", institute._id);
    navigate(`/admin/institutes/${institute.name}`);
  };

  const deleteBtn = (institute) => {
    setModalInstitute(institute);
    setDeleteInstituteModal(true);
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
          ) : allInstitutes.length ? (
            <div className="container_3">
              <div className="all_heading">
                <h1>All Institutes</h1>
                <div>
                  <input
                    placeholder="Search Institute"
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
                        <th scope="col">Institute</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collection.map((institute, index) => (
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
                                  onClick={() => deleteBtn(institute)}
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
                      onChange={updatePage}
                      current={currentPage}
                      total={allInstitutes.length}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p>No institute with the search input found</p>
                </div>
              )}
              {deleteInstituteModal && (
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
        </div>
      </div>
    </div>
  );
}

export default Institutes;
