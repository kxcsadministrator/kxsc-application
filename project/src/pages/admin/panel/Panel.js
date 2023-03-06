import { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../../../context/Context";
import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import "./panel.css";
import BarChart from "../../../component/admin/panel/BarChart";
import PieChart from "../../../component/admin/panel/PieChart";
import axios from "axios";

// import image from './image/user2.jpg';

function Panel() {
  const { user } = useContext(Context);
  const [users, setUsers] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const getAll = async () => {
      try {
        const res = await axios.get("http://13.36.208.80:3000/users/all", {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setUsers(res.data);
      } catch (err) {}
      try {
        const res = await axios.get("http://13.36.208.80:3001/institutes/all", {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setInstitutes(res.data);
      } catch (err) {}

      try {
        const res = await axios.get("http://13.36.208.80:3002/resources/all", {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setResources(res.data);
      } catch (err) {}
    };
    getAll();
  }, [user.jwt_token]);

  return (
    <div className="panel_container">
      <div className="w-[24%] relative">
        <Sidebar />
      </div>
      <div className="w-[82%]">
        <div>
          <Topbar />
        </div>
        <div className="grid gap-5 my-10">
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
        <div className="flex gap-6 px-4 justify-between min-h-[45%]">
          <div className="bg-white rounded-md shadow-md w-[60%] p-4">
            <BarChart />
          </div>
          <div className="bg-white rounded-md shadow-md w-[35%] p-4 flex flex-col items-center">
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Panel;
