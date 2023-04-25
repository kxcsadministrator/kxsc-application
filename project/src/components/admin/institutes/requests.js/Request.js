import { useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import RequestModal from "./RequestModal";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

function Request({ instituteId, admin }) {
  //states
  const [request, setRequest] = useState([]);
  const { user } = useContext(Context);
  const id = sessionStorage.getItem("id");
  const [requestModal, setRequestModal] = useState(false);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const [value, setValue] = useState("");

  //calling all request
  useEffect(() => {
    const getRequest = async () => {
      try {
        const res = await axios.get(
          `http://15.188.62.53:3001/institutes/publish-requests/${id}`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        console.log(res.data);
        setRequest(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRequest();
  }, [user.jwt_token, id]);

  //pagination Data
  const countPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(request?.slice(0, countPerPage))
  );

  //search content
  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        request
          .filter(
            (item) => item.resource.topic.toLowerCase().indexOf(query) > -1
          )
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [request]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(request?.slice(from, to)));
    },
    [request]
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

  //publish request
  const publish = async (resourceId) => {
    setStates({ loading: true, error: false });
    setRequestModal(true);
    try {
      const res = await axios({
        method: "post",
        url: `http://15.188.62.53:3001/institutes/publish-to-institute/${instituteId}/${resourceId}`,
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
  return (
    <div>
      <div className="all_heading my-3">
        {collection?.length > 0 && (
          <div>
            <input
              placeholder="Search Members"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        )}
      </div>
      {collection?.length ? (
        <div>
          <table>
            <thead>
              <tr>
                <th scope="col">s/n</th>
                <th scope="col">Request</th>
                {(user.superadmin || admin) && <th scope="col">Action</th>}
              </tr>
            </thead>
            <tbody>
              {collection?.map((request, index) => (
                <tr key={index}>
                  <td data-label="s/n">{index + 1}</td>
                  <td data-label="Resource">{request.resource.topic}</td>
                  <td data-label="Action">
                    {(user.superadmin || admin) && (
                      <div className="flex gap-3 items-center md:justify-center justify-end">
                        <button
                          className="btn_green"
                          onClick={() => publish(request.resource._id)}
                        >
                          Publish
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="paginate my-4">
            {request > countPerPage && (
              <Pagination
                pageSize={countPerPage}
                onChange={updatePage}
                current={currentPage}
                total={request?.length}
              />
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>No Request</p>
        </div>
      )}
      <div className="relative w-full h-full">
        {requestModal && (
          <RequestModal setRequestModal={setRequestModal} states={states} />
        )}
      </div>
    </div>
  );
}

export default Request;
