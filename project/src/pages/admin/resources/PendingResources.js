import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";
import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import RequestModal from "../../../component/admin/institutes/requests.js/RequestModal";

function PendingResources() {
  const { user } = useContext(Context);
  const [pendingResources, setPendingResources] = useState([]);

  //request Modal
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [requestModal, setRequestModal] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const getRequest = async () => {
      try {
        const res = await axios.get(
          `http://13.36.208.80:3000/users/admin-publish-requests`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        console.log(res.data);
        setPendingResources(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRequest();
  }, [user.jwt_token]);

  const publish = async (id) => {
    setErr(false);
    setLoading(true);
    setRequestModal(true);
    try {
      const res = await axios({
        method: "post",
        url: `http://13.36.208.80:3000/users/admin-publish/${id}`,
        headers: { Authorization: `Bearer ${user.jwt_token}` },
      });
      console.log(res.data);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setRequestModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      setLoading(false);
      setErr(true);
      setErrMsg(err.response.data);
    }
  };

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>

        <div className="py-2 px-5">
          {pendingResources?.length === 0 ? (
            <div>
              <h1>No pending Resources</h1>
            </div>
          ) : (
            <>
              <table className="bg-white rounded-md shadow-md">
                <thead>
                  <tr>
                    <th scope="col">s/n</th>
                    <th scope="col">Resources</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingResources.map((resources, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{resources.resource.topic}</td>
                      <td>
                        <button
                          className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
                          onClick={() => publish(resources.resource._id)}
                        >
                          Publish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
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
  );
}

export default PendingResources;
