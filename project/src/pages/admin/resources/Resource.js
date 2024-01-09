import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import "./resource.css";
import RequestModalR from "../../../components/admin/institutes/resources/RequestModalR";
import ResourceFiles from "../../../components/admin/institutes/resources/resource_files/ResourceFiles";
import API_URL from "../../../Url";
import Rating from "../../../components/Rating";
import EditResource from "../../../components/admin/institutes/resources/EditResource";
import ChangeAvatarModal from "../../../components/admin/institutes/resources/ChangeAvatarModal";

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
  const [editResourceModal, setEditResourceModal] = useState(false);
  const [changeAvatarModal, setChangeAvatarModal] = useState(false);

  //requestModal states

  useEffect(() => {
    const getResources = async () => {
      try {
        const res = await axios.get(`${API_URL.resource}/resources/one/${id}`, {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setResource(res.data);
      } catch (err) {}
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
        url: `${API_URL.resource}/resources/request-institute-publish/${resource.id}`,
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
        success: false,
        error: true,
        errMsg: err.response.data.message,
      });
    }
  };

  const changeAvatar = () => {};

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
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between wrap ">
                <h2 className="my-2 text-lg md:text-2xl lg:text-3xl">
                  {resource.topic}
                </h2>
                <button
                  className="btn_green"
                  onClick={() => setEditResourceModal(true)}
                >
                  Edit
                </button>
              </div>
              <div className="flex justify-between gap-2 md:flex-row flex-col mt-3 items-center">
                <div>
                  <div className="resource_row">
                    <p>By: {resource.author.username}</p>
                    <p>Institute: {resource.institute.name}</p>
                    {resource.rating > 0 && (
                      <div className="-mt-4">
                        <Rating rating={resource.rating} />
                      </div>
                    )}
                  </div>
                  <div className="resource_row -mt-2">
                    <p>Category: {resource.category}</p>
                    <p>
                      Sub-categories:{" "}
                      {resource.sub_categories.map((sub, index) => (
                        <span key={index}>{sub}</span>
                      ))}
                    </p>
                    <p>Resource type: {resource.resource_type}</p>
                  </div>
                  <div className="resource_row -mt-2">
                    <div className="flex gap-2">
                      <p>Citations: </p>
                      {resource.citations && (
                        <div className="flex gap-2 items-center">
                          {resource.citations.map((cite, index) => (
                            <p key={index}>{cite}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {(user.id === resource.author._id || user.superadmin) && (
                      <button
                        className="btn_green"
                        onClick={() => publishRequest()}
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-[250px] h-[250px] contain flex flex-col gap-2">
                  {resource.avatar ? (
                    <div>
                      <img
                        src={`${API_URL.resource}/${resource.avatar}`}
                        alt="avatar resource"
                        className="object-cover h-full w-full rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="fvv-image">
                      <img
                        src="/default.png"
                        alt="default"
                        className="object-cover h-full w-full rounded-md"
                      />
                    </div>
                  )}
                  <button
                    className="btn_green w-fit"
                    onClick={() => setChangeAvatarModal(true)}
                  >
                    Change Avatar
                  </button>
                </div>
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
        <div className="relative w-full h-full">
          {editResourceModal && (
            <EditResource
              setEditResourceModal={setEditResourceModal}
              // instituteId={instituteId}
              resource={resource}
            />
          )}
          {changeAvatarModal && (
            <ChangeAvatarModal
              setChangeAvatarModal={setChangeAvatarModal}
              resource={resource}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Resource;
