import { useState, useContext } from "react";
import CreateResource from "./CreateResource";
import { Context } from "../../../../context/Context";
import axios from "axios";
import RequestModal from "../requests.js/RequestModal";

function Resources({ resources, instituteId, admin }) {
  const { user } = useContext(Context);
  const [createResourceModal, setCreateResourceModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [requestModal, setRequestModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const publish = async (id) => {
    setErr(false);
    setLoading(true);
    setRequestModal(true);
    try {
      const res = await axios({
        method: "post",
        url: `http://13.36.208.80:3001/institutes/request-to-publish/${instituteId}/${id}`,
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
      {(user.superadmin || admin) && (
        <button
          className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
          onClick={() => setCreateResourceModal(true)}
        >
          Add resource
        </button>
      )}
      {resources?.length ? (
        <table className="bg-white rounded-md shadow-md">
          <thead>
            <tr>
              <th scope="col">s/n</th>
              <th scope="col">Resources</th>
              {admin && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {resources?.map((resource, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{resource.topic}</td>
                {(user.superadmin || admin) && (
                  <td>
                    <button
                      className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
                      onClick={() => publish(resource._id)}
                    >
                      Publish
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
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

export default Resources;
