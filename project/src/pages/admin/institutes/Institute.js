import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import Admin from "../../../components/admin/institutes/admin/Admin";
import Files from "../../../components/admin/institutes/all_files/Files";
import Members from "../../../components/admin/institutes/members/Members";
import Resources from "../../../components/admin/institutes/resources/Resources";
import Tasks from "../../../components/admin/institutes/tasks/Tasks";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import Request from "../../../components/admin/institutes/requests.js/Request";
import axios from "axios";
import "./institutes.css";
import API_URL from "../../../url";

function Institute() {
  const { user } = useContext(Context);
  const [institute, setInstitute] = useState([]);
  const id = sessionStorage.getItem("id");
  const [admin, setAdmin] = useState(false);

  //tab active states
  const [activeIndex, setActiveIndex] = useState(1);
  const handleClick = (index) => setActiveIndex(index);
  const checkActive = (index, className) =>
    activeIndex === index ? className : "";
  useEffect(() => {
    const getInstitute = async () => {
      try {
        const res = await axios.get(
          `${API_URL.institute}/institutes/one/${id}`,
          { headers: { Authorization: `Bearer ${user.jwt_token}` } }
        );
        setInstitute(res.data);
        if (res.data.admins[0]._id === user.id) {
          setAdmin(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getInstitute();
  }, [id, user.jwt_token, admin, user.id]);

  console.log(institute);

  return (
    <>
      <div className="base_container">
        <div className="sidebar_content">
          <Sidebar />
        </div>
        <div className="main_content">
          <div>
            <Topbar />
          </div>
          <div className="institute_name">
            <p>{institute.name}</p>
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
            {(user.superadmin || admin) && (
              <button
                className={`tab ${checkActive(6, "active")}`}
                onClick={() => handleClick(6)}
              >
                requests
              </button>
            )}
          </div>
          <div className="panels">
            <div className={`panel ${checkActive(1, "active")}`}>
              <Admin instituteId={institute.id} admins={institute.admins} />
            </div>
            <div className={`panel ${checkActive(2, "active")}`}>
              <Files
                files={institute.files}
                instituteId={institute.id}
                admin={admin}
              />
            </div>
            <div className={`panel ${checkActive(3, "active")}`}>
              <Members
                members={institute.members}
                instituteId={institute.id}
                admin={admin}
              />
            </div>
            <div className={`panel ${checkActive(4, "active")}`}>
              <Resources
                resources={institute.resources}
                instituteId={institute.id}
                admin={admin}
              />
            </div>
            <div className={`panel ${checkActive(5, "active")}`}>
              <Tasks
                tasks={institute.tasks}
                instituteId={institute.id}
                admin={admin}
              />
            </div>
            <div className={`panel ${checkActive(6, "active")}`}>
              <Request instituteId={institute.id} admin={admin} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Institute;
