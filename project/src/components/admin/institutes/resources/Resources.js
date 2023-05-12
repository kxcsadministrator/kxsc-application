import { useState, useContext, useCallback, useEffect } from "react";
import CreateResource from "./CreateResource";
import { Context } from "../../../../context/Context";
import axios from "axios";
import RequestModal from "../requests.js/RequestModal";
import { useNavigate } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import API_URL from "../../../../url";

function Resources({ resources, instituteId, admin }) {
  //states
  const { user } = useContext(Context);
  const [createResourceModal, setCreateResourceModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const navigate = useNavigate();
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const [value, setValue] = useState("");

  //publish function
  const publish = async (id) => {
    setStates({ loading: true, error: false });
    setRequestModal(true);
    try {
      const res = await axios({
        method: "post",
        url: `${API_URL.institute}/institutes/request-to-publish/${instituteId}/${id}`,
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
        error: true,
        errMsg: err.response.data.message,
        success: false,
      });
    }
  };

  //pagination Data
  const countPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(resources?.slice(0, countPerPage))
  );

  //search content
  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        resources
          .filter((item) => item.topic.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [resources]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(resources?.slice(from, to)));
    },
    [resources]
  );

  //useEffect search value
  useEffect(() => {
    if (!value) {
      updatePage(1);
    } else {
      setCurrentPage(1);
      searchData(value);
    }
  }, [value, updatePage, searchData]);

  //view resource
  const viewResource = (resource) => {
    sessionStorage.setItem("resourceId", resource._id);
    navigate(`/admin/resources/${resource.topic}`);
  };
  return (
    <div>
      <div className="all_heading my-3">
        <button
          className="top_btn"
          onClick={() => setCreateResourceModal(true)}
        >
          Add resource
        </button>
        {collection?.length > 0 && (
          <div>
            <input
              placeholder="Search Resources"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        )}
      </div>

      {collection?.length > 0 ? (
        <div>
          <table className="bg-white rounded-md shadow-md">
            <thead>
              <tr>
                <th scope="col">s/n</th>
                <th scope="col">Resources</th>
                {(admin || user.superadmin) && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {collection.map((resource, index) => (
                <tr key={index}>
                  <td data-label="s/n">{index + 1}</td>
                  <td data-label="Topic">{resource.topic}</td>
                  <td data-label="Action">
                    <div className="flex justify-end md:justify-center items-between gap-3">
                      <button
                        className="btn_gray"
                        onClick={() => viewResource(resource)}
                      >
                        view
                      </button>
                      {(user.superadmin || admin) && (
                        <button
                          className="btn_green"
                          onClick={() => publish(resource._id)}
                        >
                          publish
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="paginate my-4">
            {resources > countPerPage && (
              <Pagination
                pageSize={countPerPage}
                onChange={updatePage}
                current={currentPage}
                total={resources?.length}
              />
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>No Resources</p>
        </div>
      )}

      <div className="relative w-full h-full">
        {createResourceModal && (
          <CreateResource
            setCreateResourceModal={setCreateResourceModal}
            instituteId={instituteId}
          />
        )}
      </div>
      <div className="relative w-full h-full">
        {requestModal && (
          <RequestModal setRequestModal={setRequestModal} states={states} />
        )}
      </div>
    </div>
  );
}

export default Resources;
