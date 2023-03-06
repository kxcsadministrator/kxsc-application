import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import Admin from "../../../component/admin/institutes/admin/Admin";
import Files from "../../../component/admin/institutes/all_files/Files";
import Members from "../../../component/admin/institutes/members/Members";
import Resources from "../../../component/admin/institutes/Resources";
import Tasks from "../../../component/admin/institutes/tasks/Tasks";
import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import axios from "axios";
import "./institutes.css";

function Institute() {
  const { user } = useContext(Context);
  const [institute, setInstitute] = useState([]);
  const id = sessionStorage.getItem("id");

  //tab active states
  const [activeIndex, setActiveIndex] = useState(1);
  const handleClick = (index) => setActiveIndex(index);
  const checkActive = (index, className) =>
    activeIndex === index ? className : "";
  useEffect(() => {
    const getInstitute = async () => {
      try {
        const res = await axios.get(
          `http://13.36.208.80:3001/institutes/one/${id}`,
          { headers: { Authorization: `Bearer ${user.jwt_token}` } }
        );
        setInstitute(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getInstitute();
  }, [id, user.jwt_token]);

  return (
    <>
      <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
        <div className="w-[24%]">
          <Sidebar />
        </div>
        <div className="w-[82%]">
          <div>
            <Topbar />
          </div>
          <div className="tabs">
            <button
              className={`tab ${checkActive(1, "active")}`}
              onClick={() => handleClick(1)}
            >
              Admins
            </button>
            <button
              className={`tab ${checkActive(2, "active")}`}
              onClick={() => handleClick(2)}
            >
              Files
            </button>
            <button
              className={`tab ${checkActive(3, "active")}`}
              onClick={() => handleClick(3)}
            >
              Members
            </button>
            <button
              className={`tab ${checkActive(4, "active")}`}
              onClick={() => handleClick(4)}
            >
              Resources
            </button>
            <button
              className={`tab ${checkActive(5, "active")}`}
              onClick={() => handleClick(5)}
            >
              tasks
            </button>
          </div>
          <div className="panels">
            <div className={`panel ${checkActive(1, "active")}`}>
              <Admin instituteId={institute.id} admins={institute.admins} />
            </div>
            <div className={`panel ${checkActive(2, "active")}`}>
              <Files files={institute.files} instituteId={institute.id} />
            </div>
            <div className={`panel ${checkActive(3, "active")}`}>
              <Members members={institute.members} instituteId={institute.id} />
            </div>
            <div className={`panel ${checkActive(4, "active")}`}>
              <Resources
                resources={institute.resources}
                instituteId={institute.id}
              />
            </div>
            <div className={`panel ${checkActive(5, "active")}`}>
              <Tasks tasks={institute.tasks} instituteId={institute.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Institute;
