import React from "react";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
import Sidebar from "../../component/admin/Sidebar";
import Topbar from "../../component/admin/Topbar";

function Task() {
  //states
  const { user } = useContext(Context);
  const id = sessionStorage.getItem("taskId");
  const [task, setTask] = useState([]);

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
          url: `http://52.47.163.4:3001/tasks/one/${id}`,
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        console.log(res.data);
        setTask(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getTask();
  }, [id, user.jwt_token, task]);

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
              <h3>Author: {task?.author.username}</h3>
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
            <div className={`panel ${checkActive(1, "active")}`}></div>
            <div className={`panel ${checkActive(2, "active")}`}></div>
            <div className={`panel ${checkActive(3, "active")}`}></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Task;
