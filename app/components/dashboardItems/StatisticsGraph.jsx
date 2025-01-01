import { useAuthStore } from "@/app/store/Auth";
import LoadingLogo from "@/app/components/LoadingLogo";
import styles from "@/app/styles/statistics.module.css";
import { useState, useRef, useEffect , useCallback} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      align: "start",
      labels: {
        padding: 20,
        font: {
          size: 14,
          weight: "bold",
        },
        color: "#6cd7ff",
        usePointStyle: true,
        pointStyle: "rect",
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 12,
        },
        color: "#6cd7ff",
        callback: (value) => `$${value}`,
      },
      grid: {
        color: "rgb(28, 43, 75)",
      },
    },
    x: {
      ticks: {
        font: {
          size: 12,
        },
        color: "#6cd7ff",
      },
      grid: {
        color: "rgb(28, 43, 75)",
      },
    },
  },
};

export default function StatisticGraph() {
  const { getRevenueAnalytics } = useAuthStore();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dateInputRef = useRef(null);

  const fetchAnalytics = useCallback(async () => {
    const response = await getRevenueAnalytics();
    if (response.success) {
      setAnalyticsData(response.data);
    }
  }, [getRevenueAnalytics]);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedYear, fetchAnalytics]);


  if (!analyticsData) {
    return <LoadingLogo/>;
  }

  const data = {
    labels: analyticsData.monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: analyticsData.monthlyData.map(item => item.revenue),
        backgroundColor: "rgb(0, 237, 161)",
        borderColor: "#00eda1",
      },
      {
        label: 'Weekly Plans',
        data: analyticsData.monthlyData.map(item => item.weeklyPlans),
        backgroundColor: "rgb(108, 215, 255)",
        borderColor: "#6cd7ff",
      },
      {
        label: 'Monthly Plans',
        data: analyticsData.monthlyData.map(item => item.monthlyPlans),
        backgroundColor: "rgb(255, 159, 67)",
        borderColor: "#ff9f43",
      }
    ],
  };

  return (
    <div className={styles.StatisticsComponent}>  
      <div className={styles.barGraph}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}