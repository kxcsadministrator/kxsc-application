import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import RequestModal from "./RequestModal";

function Request({ instituteId, admin }) {
  const [request, setRequest] = useState([]);
  const { user } = useContext(Context);
  const id = sessionStorage.getItem("id");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [requestModal, setRequestModal] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const getRequest = async () => {
      try {
        const res = await axios.get(
          `http://13.36.208.80:3001/institutes/publish-requests/${id}`,
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

  const publish = async (resourceId) => {
    setErr(false);
    setLoading(true);
    setRequestModal(true);
    try {
      const res = await axios({
        method: "post",
        url: `http://13.36.208.80:3001/institutes/publish-to-institute/${instituteId}/${resourceId}`,
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
    <div>
      {request?.length ? (
        <table className="bg-white rounded-md shadow-md">
          <thead>
            <tr>
              <th scope="col">s/n</th>
              <th scope="col">Request</th>
              {(user.superadmin || admin) && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {request?.map((request, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{request.resource.topic}</td>
                <td>
                  {(user.superadmin || admin) && (
                    <button
                      className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
                      onClick={() => publish(request.resource._id)}
                    >
                      Publish
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <p>No Request</p>
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
  );
}

export default Request;
