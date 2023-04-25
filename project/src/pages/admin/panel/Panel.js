import { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../../../context/Context";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import "./panel.css";
import BarChart from "../../../components/admin/panel/BarChart";
import PieChart from "../../../components/admin/panel/PieChart";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { HiUser } from "react-icons/hi";
import { FaSchool } from "react-icons/fa";
import { GiBookCover } from "react-icons/gi";
import { FaEye } from "react-icons/fa";

// import image from './image/user2.jpg';

function Panel() {
  const { user } = useContext(Context);
  const [users, setUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [resources, setResources] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const navigate = useNavigate();

  console.log(dashboard);

  useEffect(() => {
    const getAll = async () => {
      if (!user.superadmin) {
        try {
          const res = await axios.get(
            `http://15.188.62.53:3000/users/my-dashboard`,
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setDashboard(res.data);
        } catch (err) {}
      } else {
        try {
          const res = await axios.get(`http://15.188.62.53:3000/users/all`, {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          });
          setUsers(res.data);
        } catch (err) {}

        try {
          const res = await axios.get(
            `http://15.188.62.53:3000/users/all?page=1&limit=3`,
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
            `http://15.188.62.53:3001/institutes/all`,
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setInstitutes(res.data);
        } catch (err) {}

        try {
          const res = await axios.get(
            `http://15.188.62.53:3002/resources/all`,
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

  const viewResource = (resource) => {
    sessionStorage.setItem("resourceId", resource._id);
    navigate(`/admin/resources/${resource.topic}`);
  };
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
                  <p>{user?.main_institute?.name} Resources</p>
                  <p
                    className="link hover:text-black"
                    onClick={() =>
                      viewInstitute(dashboard?.institute_resource?._id)
                    }
                  >
                    View institute
                  </p>
                </div>

                {dashboard?.institute_resource?.resources.length ? (
                  dashboard?.institute_resource?.resources.map(
                    (resource, index) => (
                      <div className="obj_body my-2" key={index}>
                        <div className="lg:w-[20%] md:[40%] w-[60%]">
                          {resource.avatar === null ? (
                            <img src="/default.png" alt="default" />
                          ) : (
                            <img
                              src={`http://15.188.62.53:3002/${resource.avatar}`}
                              alt="default"
                              className="object-cover h-full w-full"
                            />
                          )}
                        </div>
                        <div className="obj_text">
                          <div>
                            <p className="text-[13px] text-[#c3c3c3]">
                              {dashboard.institute_resource.name}
                            </p>
                            <p className="font-bold text-lg -mt-3">
                              {resource.topic}
                            </p>
                            <p className="flex items-center gap-3 text-sm  -mt-2 ">
                              <span>
                                {resource.rating === 0
                                  ? "No rating"
                                  : resource.rating + "/5"}
                              </span>
                              <span>Released: {resource.date}</span>
                            </p>
                            <button
                              onClick={() => viewResource(resource)}
                              className="hover:text-green_bg px-2 py-1 border-gray_bg bg-[#e9e9e9] rounded-sm "
                            >
                              <FaEye />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="obj_default">
                    <div className="lg:w-[20%] md:[40%] w-[60%]">
                      <img src="/default.png" alt="default" />
                    </div>
                    <div className="obj_text">
                      <p>Its a bit lonely here</p>
                    </div>
                  </div>
                )}
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
                    <div className="obj_body my-2" key={index}>
                      <div className="lg:w-[20%] md:[40%] w-[60%]">
                        {resource.avatar === null ? (
                          <img src="/default.png" alt="default" />
                        ) : (
                          <img
                            src={`http://15.188.62.53:3002/${resource.avatar}`}
                            alt="default"
                            className="object-cover h-full w-full"
                          />
                        )}
                      </div>
                      <div className="obj_text">
                        <div className="flex flex-col">
                          <p className="font-bold text-lg -mt-3">
                            {resource.topic}
                          </p>
                          <p className="flex items-center gap-3 text-sm  -mt-2 ">
                            <span>
                              {resource.rating === 0
                                ? "No rating"
                                : resource.rating + "/5"}
                            </span>
                            <span>Released: {resource.date}</span>
                          </p>
                          <button
                            onClick={() => viewResource(resource)}
                            className="hover:text-green_bg px-2 py-1 border-gray_bg bg-[#e9e9e9] rounded-sm w-8"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="obj_default">
                    <div className="lg:w-[20%] md:[40%] w-[60%]">
                      <img src="/default.png" alt="default" />
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
                    <div className="lg:w-[20%] md:[40%] w-[60%]">
                      <img src="/book.png" alt="default" />
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
                      to="/admin/institute"
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
                    <div className="lg:w-[20%] md:[40%] w-[60%]">
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
