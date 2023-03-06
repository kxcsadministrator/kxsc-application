import { useState, useContext, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Context } from "../../../context/Context";
import axios from "axios";
import "../../../pages/admin/panel/panel.css";

function BarChart() {
  Chart.register(...registerables);
  const { user } = useContext(Context);
  const [resource, setResource] = useState([]);
  const [resources, setResources] = useState([]);
  const chartData = {
    labels: resource.map((data) => data._id.month),
    datasets: [
      {
        label: "resources",
        data: resource.map((data) => data.count),
        backgroundColor: ["#50AF95"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };

  useEffect(() => {
    const getAll = async () => {
      try {
        const res = await axios.get(
          "http://13.36.208.80:3002/resources/monthly-stats",
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setResource(res.data);
        console.log(res.data);
      } catch (err) {}
      try {
        const res = await axios.get("http://35.181.43.119:3002/resources/all", {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setResources(res.data);
        console.log(res.data);
      } catch (err) {}
    };
    getAll();
  }, [user.jwt_token]);
  return (
    <div className="h-full">
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Monthly Resources",
            },
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}

export default BarChart;
