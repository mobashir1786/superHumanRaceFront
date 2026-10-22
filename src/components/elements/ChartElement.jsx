
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function ChartElement({ element }) {
    const isBarChart = element.type === "barChart";
    const labels = element.chartLabels ?? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const values = element.chartValues ?? [120, 190, 150, 250, 210, 300];

    const data = {
        labels,
        datasets: [
            {
                label: element.title || "Monthly Sales",
                data: values,
                backgroundColor: isBarChart
                    ? "rgba(59, 130, 246, 0.75)"
                    : "rgba(59, 130, 246, 0.12)",
                borderColor: "#3b82f6",
                borderWidth: 2,
                borderRadius: isBarChart ? 5 : 0,
                tension: 0.35,
                fill: !isBarChart,
                pointRadius: 4,
                pointBackgroundColor: "#3b82f6",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 300,
        },
        plugins: {
            legend: {
                display: false,
                position: "top",
            },
            title: {
                display: true,
                text: element.title || "Monthly Sales",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="chart-element">
            {isBarChart ? (
                <Bar data={data} options={options} />
            ) : (
                <Line data={data} options={options} />
            )}
        </div>
    );
}
