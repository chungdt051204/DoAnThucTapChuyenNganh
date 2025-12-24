import { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import DailyRevenueChart from "./DailyRevenueChart";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import "./components-css/Dashboard.css";
export default function DashBoard() {
  const { refresh, courses, users, orders } = useContext(AppContext);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [bestSellerCourses, setBestSellerCourses] = useState([]);
  let totalRevenue = 0;
  orders.length > 0 &&
    orders.forEach((value) => {
      totalRevenue = totalRevenue + value.totalAmount;
    });
  useEffect(() => {
    fetchAPI({ url: `${url}/daily-revenue`, setData: setDailyRevenue });
    fetchAPI({
      url: `${url}/best-seller-courses`,
      setData: setBestSellerCourses,
    });
  }, [refresh]);
  return (
    <>
      <div className="dashboard-container">
        <h2>Tổng quan Thống kê</h2>
        <div className="dashboard-stats-grid">
          <div className="dashboard-stats-card product-card">
            <div className="dashboard-card-title">Tổng khóa học</div>
            <div className="dashboard-card-value">{courses.length}</div>
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
            <div className="dashboard-card-value">{totalRevenue} VNĐ</div>
          </div>
        </div>
        <div className="dashboard-chart-area">
          <DailyRevenueChart data={dailyRevenue} />
        </div>
        {bestSellerCourses.length > 0 && (
          <div className="bestseller-table-container">
            <h3> Top Sản phẩm Bán chạy</h3>
            <table className="bestseller-table">
              <thead>
                <tr>
                  <th className="dashboard-table-header dashboard-product-name-col">
                    Sản phẩm
                  </th>
                  <th className="dashboard-table-header dashboard-quantity-col">
                    Số lượng bán được
                  </th>
                </tr>
              </thead>
              <tbody>
                {bestSellerCourses.map((value, index) => {
                  return (
                    <tr key={index} className="dashboard-table-row">
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
