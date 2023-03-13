import { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../../../context/Context";
import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import "./panel.css";
import BarChart from "../../../component/admin/panel/BarChart";
import PieChart from "../../../component/admin/panel/PieChart";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// import image from './image/user2.jpg';

function Panel() {
  const { user } = useContext(Context);
  const [users, setUsers] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [resources, setResources] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getAll = async () => {
      if (!user.superadmin) {
        try {
          const res = await axios.get(
            "http://13.36.208.80:3000/users/my-dashboard",
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setDashboard(res.data);
          console.log(res.data);
        } catch (err) {}
      } else {
        try {
          const res = await axios.get("http://13.36.208.80:3000/users/all", {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          });
          setUsers(res.data);
        } catch (err) {}

        try {
          const res = await axios.get(
            "http://13.36.208.80:3001/institutes/all",
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setInstitutes(res.data);
        } catch (err) {}

        try {
          const res = await axios.get(
            "http://13.36.208.80:3002/resources/all",
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setResources(res.data);
        } catch (err) {}
      }
    };
    getAll();
  }, [user.jwt_token, user.superadmin]);

  const viewInstitute = (institute) => {
    sessionStorage.setItem("id", institute);
    navigate(`/admin/institutes/${dashboard?.institute_resource?.name}`);
  };
  console.log(dashboard?.institute_resource?.resources?.institute);

  return (
    <div className="panel_container">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>
        {user.superadmin ? (
          <>
            <div className="panel_content">
              {/* box containers*/}

              <div className="box_container">
                {/* user_box */}
                <div className="box">
                  <div className="flex justify-between">
                    <div className="text_container">
                      <h4>Total User</h4>
                      <p>{users.length}</p>
                    </div>
                    <div className="circle_1" />
                  </div>
                </div>
                {/* institute_box */}
                <div className="box">
                  <div className="flex justify-between">
                    <div className="text_container">
                      <h4>Total Institute</h4>
                      <p>{institutes.length}</p>
                    </div>
                    <div className="circle_2" />
                  </div>
                </div>
                {/* resource_box */}
                <div className="box">
                  <div className="flex justify-between">
                    <div className="text_container">
                      <h4>Total Resource</h4>
                      <p>{resources.length}</p>
                    </div>
                    <div className="circle_3" />
                  </div>
                </div>
              </div>
            </div>
            {/* charts */}
            <div className="chart_container">
              <div className="barchart_container">
                <BarChart />
              </div>
              <div className="piechart_container">
                <PieChart />
              </div>
            </div>
          </>
        ) : (
          <div className="panel_content">
            {/* published Resources */}
            <div className="obj_container">
              <div className="obj_content">
                <div className="obj_heading">
                  <p>Publish Resources</p>
                  <p
                    className="link hover:text-black"
                    onClick={() =>
                      viewInstitute(
                        dashboard?.institute_resource?.resources[0]?.institute
                      )
                    }
                  >
                    View institute
                  </p>
                </div>
                <div className="obj_body">
                  <div className="w-[20%]">
                    <img src="/default.png" alt="default" />
                  </div>
                  <div className="obj_text">
                    {dashboard?.institute_resource?.resources?.map(
                      (resource, index) => (
                        <ul className="flex flex-col">
                          <li key={index}>{resource.topic}</li>
                          <li>{resource.author}</li>
                          <li>{resource.rating}</li>
                          <li>{resource.date}</li>
                        </ul>
                      )
                    )}
                  </div>
                </div>
              </div>
              {/* my Resources */}
              <div className="obj_content">
                <div className="obj_heading">
                  <p>My Resources</p>
                  <p>
                    <Link
                      className="link hover:text-black"
                      to="/admin/resources"
                    >
                      View all resources
                    </Link>
                  </p>
                </div>
                {dashboard?.user_resources?.length ? (
                  <div className="obj_body">
                    <div className="w-[20%]">
                      <img src="/default.png" alt="default" />
                    </div>
                    <div className="obj_text">
                      {dashboard?.user_resources?.map((resource, index) => (
                        <ul className="flex flex-col">
                          <li key={index}>{resource.topic}</li>
                          <li>{resource.author}</li>
                          <li>{resource.rating}</li>
                          <li>{resource.date}</li>
                        </ul>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="obj_default">
                    <div className="w-[20%]">
                      <img src="/default.png" alt="default" />
                    </div>
                    <div className="obj_text">
                      <p>Its a bit lonely here</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Institutes */}
              <div className="obj_content">
                <div className="obj_heading">
                  <p>My Institutes</p>
                  <p>
                    <Link
                      className="link hover:text-black"
                      to="/admin/resources"
                    >
                      View all institutes
                    </Link>
                  </p>
                </div>
                {dashboard?.user_institutes?.length ? (
                  <div>
                    {dashboard?.user_institutes?.map((institute, index) => (
                      <div className="obj_body" key={index}>
                        <p className="obj_text">{institute.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-[30%]">
                      <img src="/book.png" alt="default" />
                    </div>
                    <div className="obj_text">
                      <p>Its a bit lonely here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* published Resources */}
              <div className="obj_content">
                <div className="obj_heading">
                  <p>My Tasks</p>
                </div>
                {dashboard?.user_tasks?.length ? (
                  <div>
                    {dashboard?.user_tasks?.map((task, index) => (
                      <div className="obj_body " key={index}>
                        <p className="w-5">
                          <img src="/ellipse.png" alt="default" />
                        </p>
                        <p>{task.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-[30%]">
                      <img src="/book.png" alt="default" />
                    </div>
                    <div className="obj_text">
                      <p>Its a bit lonely here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Panel;
