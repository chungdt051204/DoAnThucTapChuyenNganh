import { useEffect, useState, useContext } from "react";
import AppContext from "../components/AppContext";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/DashBoard.css";
import ColumnChart from "../components/ColumnChart";
import LineChart from "../components/LineChart";

export default function DashBoard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const option = searchParams.get("option");
  const { isLoading, isLogin, refresh, user, courses, users, orders } =
    useContext(AppContext);
  const [revenues, setRevenues] = useState([]);
  const [bestSellerCourses, setBestSellerCourses] = useState([]);
  const [selectedValue, setSelectedValue] = useState(option || "");

  //Tính tổng doanh thu các đơn hàng đã thanh toán thành công
  const totalRevenue = () => {
    let totalRevenue = 0;
    orders?.forEach((value) => {
      totalRevenue = totalRevenue + value.totalAmount;
    });
    return totalRevenue;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (!isLoading) {
      if (!isLogin || user?.role !== "admin") {
        navigate("/");
        return;
      }
    }
  }, [isLogin, isLoading, navigate, user]);

  useEffect(() => {
    if (!isLoading && isLogin && user?.role === "admin") {
      const params = new URLSearchParams();
      if (option) params.append("option", option);
      fetchAPI({
        url: `${url}/revenue?${params.toString()}`,
        setData: setRevenues,
      });
      fetchAPI({
        url: `${url}/best-seller-courses`,
        setData: setBestSellerCourses,
      });
    }
  }, [refresh, user, isLogin, isLoading, option]);

  const handleChange = (value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value !== "") {
        setSelectedValue(value);
        newParams.set("option", value);
      } else {
        setSelectedValue("");
        if (newParams.has("option")) newParams.delete("option");
      }
      return newParams;
    });
  };

  return (
    <>
      <div className="dashboard-container">
        <h2>Tổng quan Thống kê</h2>
        <div className="dashboard-stats-grid">
          <div className="dashboard-stats-card product-card">
            <div className="dashboard-card-title">Tổng khóa học</div>
            <div className="dashboard-card-value">{courses.docs?.length}</div>
          </div>
          <div className="dashboard-stats-card user-card">
            <div className="dashboard-card-title">Tổng Người dùng</div>
            <div className="dashboard-card-value">{users.length}</div>
          </div>
          <div className="dashboard-stats-card order-card">
            <div className="dashboard-card-title">Tổng Đơn hàng</div>
            <div className="dashboard-card-value">{orders.length}</div>
          </div>
          <div className="dashboard-stats-card revenue-card">
            <div className="dashboard-card-title">Tổng Doanh thu</div>
            <div className="dashboard-card-value">{totalRevenue()} VNĐ</div>
          </div>
        </div>
        <select
          value={selectedValue}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="">Chọn lựa chọn</option>
          <option value="1">Doanh thu từng khóa học trong ngày</option>
          <option value="2">Tổng doanh thu trong 7 ngày gần nhất</option>
        </select>
        <div className="dashboard-chart-area">
          {selectedValue !== "" ? (
            selectedValue == 1 ? (
              <ColumnChart data={revenues} />
            ) : (
              <LineChart data={revenues} />
            )
          ) : (
            <p>Vui lòng chọn 1 lựa chọn để xem biểu đồ thống kê</p>
          )}
        </div>
        {bestSellerCourses.length > 0 && (
          <div className="bestseller-table-container">
            <h3> Top khóa học bán chạy</h3>
            <table className="bestseller-table">
              <thead>
                <tr>
                  <th className="dashboard-table-header dashboard-product-name-col">
                    Khóa học
                  </th>
                  <th className="dashboard-table-header dashboard-quantity-col">
                    Số lượng bán được
                  </th>
                </tr>
              </thead>
              <tbody>
                {bestSellerCourses.map((value) => {
                  return (
                    <tr key={value._id} className="dashboard-table-row">
                      <td className="dashboard-product-cell dashboard-name-cell">
                        {value.courseName}
                      </td>
                      <td className="dashboard-product-cell dashboard-quantity-cell">
                        {value.totalSold}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
