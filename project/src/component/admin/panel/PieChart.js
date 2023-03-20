import { useState, useContext, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Context } from "../../../context/Context";
import axios from "axios";
import "../../../pages/admin/panel/panel.css";

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
          `${process.env.REACT_APP_PORT}:3002/resources/group-stats`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setResource(res.data);
        console.log(res.data);
      } catch (err) {}
    };
    getAll();
  }, [user.jwt_token]);
  return (
    <>
      <div className="max-w-[300px] w-full h-full">
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
      </div>
    </>
  );
}

export default PieChart;
