import { useState, useEffect, useContext } from "react";
import axios from "axios";
import RequestModal from "../requests.js/RequestModal";
function Details({ resource, user }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [requestModal, setRequestModal] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setErrMsg("request has already been publish or cannot be found");
    }
  };

  console.log(resource);

  return (
    <div>
      <div className="flex md:flex-row flex-col gap-10 md:justify-between items-center lg:justify-start mx-auto bg-white rounded-md w-[90%] p-4 mt-8">
        <div className="lg:w-[30%] w-[70%]">
          <img
            src={`http://13.36.208.80:3002/${resource.avatar}`}
            alt="resource avatar"
          />
        </div>
        <div>
          {resource.id ? (
            <div className="w-full">
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
              {user.id === resource.author._id && (
                <button
                  className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
                  onClick={() => publishRequest()}
                >
                  P ublish
                </button>
              )}
            </div>
          ) : (
            <div>
              <p>No resource</p>
            </div>
          )}
        </div>
        <div>
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

export default Details;
