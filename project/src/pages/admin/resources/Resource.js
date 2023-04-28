import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import "./resource.css";
import RequestModalR from "../../../components/admin/institutes/resources/RequestModalR";
import ResourceFiles from "../../../components/admin/institutes/resources/resource_files/ResourceFiles";

function Resource() {
  //states
  const { user } = useContext(Context);
  const id = sessionStorage.getItem("resourceId");
  const [resource, setResource] = useState({});
  const [requestModal, setRequestModal] = useState(false);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });

  //requestModal states

  useEffect(() => {
    const getResources = async () => {
      try {
        const res = await axios.get(
          `http://15.188.62.53:3002/resources/one/${id}`,
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

  //publish request
  const publishRequest = async () => {
    try {
      setStates({ loading: true, error: false });
      setRequestModal(true);
      const res = await axios({
        method: "post",
        url: `http://15.188.62.53:3002/resources/request-institute-publish/${resource.id}`,
        headers: { Authorization: `Bearer ${user.jwt_token}` },
      });
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setRequestModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      console.log(err.response);
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
        {resource.id ? (
          <div className="py-4 px-6 grid gap-8">
            <div className="flex flex-col">
              <h2 className="my-2 text-lg md:text-2xl lg:text-3xl">
                {resource.topic}
              </h2>
              <div>
                <div className="resource_row">
                  <p>By: {resource.author.username}</p>
                  <p>Institute: {resource.institute.name}</p>
                  {resource.rating > 0 && <p>Rating: {resource.rating}/5</p>}
                </div>
                <div className="resource_row -mt-2">
                  <p>Category: {resource.category}</p>
                  <p>
                    Sub-categories:{" "}
                    {resource.sub_categories.map((sub, index) => (
                      <span key={index}>{sub}</span>
                    ))}
                  </p>
                </div>
                <p className="-mt-2 text-gray-500">
                  Resource type: {resource.resource_type}
                </p>
              </div>
              <div>
                {(user.id === resource.author._id || user.superadmin) && (
                  <button
                    className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
                    onClick={() => publishRequest()}
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
            {resource.description && (
              <div className="flex flex-col gap-0">
                <h1 className="text-lg md:text-2xl lg:text-3xl">About</h1>
                <div>
                  <p
                    dangerouslySetInnerHTML={{ __html: resource.description }}
                  ></p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-0">
              <h1 className="text-lg md:text-2xl lg:text-3xl">Files</h1>
              <ResourceFiles resource={resource} />
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {requestModal && (
          <RequestModalR states={states} setRequestModal={setRequestModal} />
        )}
      </div>
    </div>
  );
}

export default Resource;
