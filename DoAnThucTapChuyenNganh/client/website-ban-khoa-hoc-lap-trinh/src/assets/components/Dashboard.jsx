import { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import DailyRevenueChart from "./DailyRevenueChart";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
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
          <div className="stats-card product-card">
            <div className="card-title">Tổng khóa học</div>
            <div className="card-value">{courses.length}</div>
          </div>
          <div className="stats-card user-card">
            <div className="card-title">Tổng Người dùng</div>
            <div className="card-value">{users.length}</div>
          </div>
          <div className="stats-card order-card">
            <div className="card-title">Tổng Đơn hàng</div>
            <div className="card-value">{orders.length}</div>
          </div>
          <div className="stats-card revenue-card">
            <div className="card-title">Tổng Doanh thu</div>
            <div className="card-value">{totalRevenue} VNĐ</div>
          </div>
        </div>
        <div className="dashboard-chart-area">
          <DailyRevenueChart data={dailyRevenue} />
        </div>
        {bestSellerCourses.length > 0 && (
          <div className="bestseller-table-container">
            <h3> Top 5 Sản phẩm Bán chạy</h3>
            <table className="bestseller-table">
              <thead>
                <tr>
                  <th className="table-header product-name-col">Sản phẩm</th>
                  <th className="table-header quantity-col">
                    Số lượng bán được
                  </th>
                </tr>
              </thead>
              <tbody>
                {bestSellerCourses.map((value, index) => {
                  return (
                    <tr key={index} className="table-row">
                      <td className="product-cell name-cell">
                        {value.courseName}
                      </td>
                      <td className="product-cell quantity-cell">
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
