import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import "./resource.css";
import Details from "../../../component/admin/institutes/resources/Details";
import ResourceFiles from "../../../component/admin/institutes/resources/resource_files/ResourceFiles";

function Resource() {
  const { user } = useContext(Context);
  const id = sessionStorage.getItem("resourceId");
  const [resource, setResource] = useState({});

  //requestModal states

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

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
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
              <Details resource={resource} user={user} />
            </div>
            <div className={`panel ${checkActive(2, "active")}`}>
              <ResourceFiles resource={resource} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resource;
