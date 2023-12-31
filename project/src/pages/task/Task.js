import React from "react";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import Collaborators from "../../components/admin/task/collaborators/Collaborators";
import Files from "../../components/admin/task/task_files/Files";
import Comments from "../../components/admin/task/comments/Comments";
import API_URL from "../../Url";

function Task() {
  //states
  const { user } = useContext(Context);
  const id = sessionStorage.getItem("taskId");
  const [task, setTask] = useState([]);
  const [admin, setAdmin] = useState(false);
  //tab active states
  const [activeIndex, setActiveIndex] = useState(1);
  const handleClick = (index) => setActiveIndex(index);
  const checkActive = (index, className) =>
    activeIndex === index ? className : "";
  useEffect(() => {
    const getTask = async () => {
      try {
        const res = await axios({
          method: "get",
          url: `${API_URL.institute}/tasks/one/${id}`,
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setTask(res.data);
        if (user.id === res.data.id) {
          setAdmin(true);
        }
      } catch (err) {}
    };
    getTask();
  }, [id, user.jwt_token, admin, user.id]);

  console.log(user.id);

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
            <div className="flex justify-between items-center px-5">
              <h3>{task?.institute}</h3>
              <h3>Author: {task?.author?.username}</h3>
            </div>
          </div>
          <div className="tabs">
            <button
              className={`tab ${checkActive(1, "active")}`}
              onClick={() => handleClick(1)}
            >
              collaborators
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
              Comments
            </button>
          </div>
          <div className="panels">
            <div className={`panel ${checkActive(1, "active")}`}>
              <Collaborators
                collaborators={task.collaborators}
                admin={admin}
                instituteId={task.id}
              />
            </div>
            <div className={`panel ${checkActive(2, "active")}`}>
              <Files files={task.files} admin={admin} />
            </div>
            <div className={`panel ${checkActive(3, "active")}`}>
              <Comments comments={task.comments} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Task;
