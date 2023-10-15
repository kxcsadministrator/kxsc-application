import { useState, useContext, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Context } from "../../../context/Context";
import axios from "axios";
import "../../../pages/admin/panel/panel.css";
import API_URL from "../../../Url";

function PieChart() {
  Chart.register(...registerables);
  const { user } = useContext(Context);
  const [resource, setResource] = useState([]);

  const chartData = {
    labels: resource.map((data) => data._id),
    datasets: [
      {
        label: "",
        data: resource.map((data) => data.count),
        backgroundColor: ["#3dec9a", "#3d80ec", "#ec3d3d"],
        borderColor: "white",
      },
    ],
  };
  useEffect(() => {
    const getAll = async () => {
      try {
        const res = await axios.get(
          `${API_URL.resource}/resources/group-stats`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setResource(res.data);
      } catch (err) {}
    };
    getAll();
  }, [user.jwt_token]);

  console.log(resource);
  return (
    <>
      <div className="max-w-[300px] w-full h-full">
        {resource?.length > 0 ? (
          <>
            <Pie
              data={chartData}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Resources Stats",
                  },
                  legend: {
                    display: true,
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-center text-sm ">
              No data Available for Resource Pie chart
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default PieChart;
