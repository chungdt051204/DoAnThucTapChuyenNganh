import { Bar } from "react-chartjs-2"; // 1. Thay Line thành Bar
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // 2. Thay LineElement/PointElement thành BarElement
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cho biểu đồ cột
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, // Đăng ký BarElement
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Biểu đồ Doanh thu từng khóa học hôm nay",
    },
  },
  scales: {
    y: {
      beginAtZero: true, // Biểu đồ cột nên luôn bắt đầu từ số 0
    },
  },
};

export default function ColumnChart({ data }) {
  // Trích xuất nhãn và dữ liệu từ props
  const label = data.map((value) => value.courseName) || [];
  const total = data.map((value) => value.totalAmount) || 0;

  const chartData = {
    labels: label,
    datasets: [
      {
        label: "Tổng doanh thu",
        data: total,
        // Màu sắc cho các cột (có thể dùng một mảng màu nếu muốn mỗi cột 1 màu)
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      {/* 3. Sử dụng component Bar */}
      <Bar options={options} data={chartData} />
    </div>
  );
}
