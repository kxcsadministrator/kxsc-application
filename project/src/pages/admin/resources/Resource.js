import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import "./resource.css";
import RequestModal from "../../../component/admin/institutes/requests.js/RequestModal";

function Resource() {
  const { user } = useContext(Context);
  const id = sessionStorage.getItem("resourceId");
  const [resource, setResource] = useState({});

  //requestModal states
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [requestModal, setRequestModal] = useState(false);
  const [success, setSuccess] = useState(false);
  //tab active states
  const [activeIndex, setActiveIndex] = useState(1);
  const handleClick = (index) => setActiveIndex(index);
  const checkActive = (index, className) =>
    activeIndex === index ? className : "";
  useEffect(() => {
    const getResources = async () => {
      try {
        const res = await axios.get(
          `http://13.36.208.80:3002/resources/one/${id}`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        console.log(res.data);
        setResource(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getResources();
  }, [id, user.jwt_token]);

  const publishRequest = async () => {
    try {
      setErr(false);
      setLoading(true);
      setRequestModal(true);
      const res = await axios({
        method: "post",
        url: `http://13.36.208.80:3002/resources/request-institute-publish/${resource.id}`,
        headers: { Authorization: `Bearer ${user.jwt_token}` },
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setRequestModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      console.log(err.response);
      setLoading(false);
      setErr(true);
      setErrMsg(err.response.data);
    }
  };

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="w-[24%]">
        <Sidebar />
      </div>
      <div className="w-[82%]">
        <div>
          <Topbar />
        </div>
        <div className="grid gap-4">
          <div className="tabs">
            <button
              className={`tab ${checkActive(1, "active")}`}
              onClick={() => handleClick(1)}
            >
              details
            </button>
            <button
              className={`tab ${checkActive(2, "active")}`}
              onClick={() => handleClick(2)}
            >
              Manage Files
            </button>
          </div>
          <div className="panels">
            <div className={`panel ${checkActive(1, "active")}`}>
              <div className="grid gap-2 mx-auto bg-white rounded-md w-[90%] p-4 mt-8">
                {resource.id ? (
                  <>
                    <div className="flex gap-3">
                      <p>Author:</p>
                      <p>{resource.author.username}</p>
                    </div>
                    <div className="flex gap-3">
                      <p>Category:</p>
                      <p>{resource.category}</p>
                    </div>
                    <div className="flex gap-3">
                      <p>institute:</p>
                      <p>{resource.institute.name}</p>
                    </div>
                    <div className="flex gap-3">
                      <p>Rating:</p>
                      <p>{resource.rating.average_rating}</p>
                    </div>
                    <div className="flex gap-3">
                      <p>Resource Type:</p>
                      <p>{resource.resource_type}</p>
                    </div>
                    <div className="flex gap-3">
                      <p>Sub Categories:</p>
                      <p>
                        {resource.sub_categories.map((cat, index) => (
                          <span key={index}>{cat}</span>
                        ))}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <p>Topic:</p>
                      <p>{resource.topic}</p>
                    </div>
                    <div className="flex gap-3">
                      <p>Visibility:</p>
                      <p>{resource.visibility}</p>
                    </div>
                    <button
                      className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
                      onClick={() => publishRequest()}
                    >
                      Request to publish
                    </button>
                  </>
                ) : (
                  <div>
                    <p>No resource</p>
                  </div>
                )}
                <div className="relative w-full h-full">
                  {requestModal && (
                    <RequestModal
                      setRequestModal={setRequestModal}
                      loading={loading}
                      success={success}
                      err={err}
                      errMsg={errMsg}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={`panel ${checkActive(2, "active")}`}>
              <button className="p-2 bg-[#52cb83] rounded-md w-44 text-white">
                Add files
              </button>
              {resource?.files?.length ? (
                <table className="bg-white rounded-md shadow-md">
                  <thead>
                    <tr>
                      <th scope="col">s/n</th>
                      <th scope="col">Files</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resource.files.map((file, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{file}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>
                  <p>No files found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resource;
