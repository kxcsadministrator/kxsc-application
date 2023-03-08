import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import DeleteResources from "../../../component/admin/institutes/resources/DeleteResources";
function Resources() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [allResourrces, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [deleteResourceModal, setDeleteResourceModal] = useState(false);
  const [deleteResource, setdeleteResource] = useState(false);

  useEffect(() => {
    const getResources = async () => {
      setLoading(true);
      setError(false);
      if (user.superadmin) {
        try {
          const res = await axios.get(
            "http://13.36.208.80:3002/resources/all",
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setLoading(false);
          setAllResources(res.data);
          console.log(res.data);
        } catch (err) {
          setLoading(false);
          setError(true);
          setErrMsg(err.response.data.message);
          console.log(err);
        }
      } else {
        try {
          const res = await axios.get(
            "http://13.36.208.80:3002/resources/my-resources",
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setLoading(false);
          setAllResources(res.data);
          console.log(res.data);
        } catch (err) {
          setLoading(false);
          setError(true);
          setErrMsg(err.response.data.message);
          console.log(err);
        }
      }
    };
    getResources();
  }, [user.jwt_token, user.superadmin]);

  const viewResource = (resource) => {
    sessionStorage.setItem("resourceId", resource._id);
    navigate(`/admin/resources/${resource.topic}`);
  };

  const deleteBtn = (resource) => {
    setdeleteResource(resource);
    setDeleteResourceModal(true);
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
        <div className="py-2 px-5">
          {loading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : error ? (
            <div>{errMsg}</div>
          ) : (
            <>
              {allResourrces?.length === 0 ? (
                <div>
                  <h1>No resource</h1>
                </div>
              ) : (
                <table className="bg-white rounded-md shadow-md">
                  <thead>
                    <tr>
                      <th scope="col">s/n</th>
                      <th scope="col">Resources</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allResourrces.map((resource, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{resource.topic}</td>
                        <td>
                          <div className="flex gap-3 items-center justify-center">
                            <button
                              onClick={() => viewResource(resource)}
                              className="hover:text-green_bg p-2 border-gray_bg bg-gray_bg rounded-sm"
                            >
                              <FaEye size="1.2rem" />
                            </button>
                            <button
                              className="p-2 border-gray_bg bg-gray_bg rounded-sm text-red-600"
                              onClick={() => deleteBtn(resource)}
                            >
                              <RiDeleteBinLine size="1.2rem" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
          <div className="relative w-full h-full">
            {deleteResourceModal && (
              <DeleteResources
                setDeleteResourceModal={setDeleteResourceModal}
                deleteResource={deleteResource}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
