import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";

function Resource() {
  const id = sessionStorage.getItem("resourceId");
  const [resource, setResource] = useState({});
  const { user } = useContext(Context);
  useEffect(() => {
    const getResources = async () => {
      try {
        const res = await axios.get(
          `http://35.181.43.119:3002/resources/one/${id}`,
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

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="w-[24%]">
        <Sidebar />
      </div>
      <div className="w-[82%]">
        <div>
          <Topbar />
        </div>
        <div className="bg-white rounded-md w-[90%] p-4 mt-8 mx-auto ">
          <div className="grid gap-2">
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
              </>
            ) : (
              <div>
                <p>No resource</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resource;
