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
import { HiUser } from "react-icons/hi";
import { FaSchool } from "react-icons/fa";
import { GiBookCover } from "react-icons/gi";

// import image from './image/user2.jpg';

function Panel() {
  const { user } = useContext(Context);
  const [users, setUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
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
            "http://13.36.208.80:3000/users/all?page=1&limit=3",
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setRecentUsers(res.data);
        } catch (err) {
          console.log(err);
        }

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
  console.log(dashboard);
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
                  <div className="box-col">
                    <h4>{users.length}</h4>
                    <p>Total User</p>
                  </div>
                  <div className="box-col-2">
                    <HiUser size="2.5rem" />
                  </div>
                </div>
                {/* institute_box */}
                <div className="box-2">
                  <div className="box-col">
                    <h4>{institutes.length}</h4>
                    <p>Total Institutes</p>
                  </div>
                  <div className="box-col-2">
                    <FaSchool size="2.5rem" />
                  </div>
                </div>
                {/* resource_box */}
                <div className="box-3">
                  <div className="box-col">
                    <h4>{resources.length}</h4>
                    <p>Total Resources</p>
                  </div>
                  <div className="box-col-2">
                    <GiBookCover size="2.5rem" />
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
            {recentUsers.length > 0 ? (
              <div className="flex flex-col gap-3 px-5 py-5">
                <h1 className="text-3xl">Recently registered users</h1>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">s/n</th>
                      <th scope="col">Username</th>
                      <th scope="col">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers?.map((singleUser, index) => (
                      <tr key={singleUser._id}>
                        <td data-label="s/n">{index + 1}</td>
                        <td data-label="Username">{singleUser.username}</td>
                        <td data-label="Date">{singleUser.date_registered}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div></div>
            )}
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
                      viewInstitute(dashboard?.institute_resource?._id)
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
                  dashboard.user_resources.map((resource, index) => (
                    <div className="obj_body my-2">
                      <div className="w-[20%]">
                        <img src="/default.png" alt="default" />
                      </div>
                      <div className="obj_text">
                        <ul className="flex flex-col">
                          <li key={index}>{resource.topic}</li>
                          <li>{resource.author}</li>
                          <li>{resource.rating}</li>
                          <li>{resource.date}</li>
                        </ul>
                      </div>
                    </div>
                  ))
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
