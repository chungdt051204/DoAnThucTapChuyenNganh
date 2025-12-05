import React, { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import "./components-css/QuanLyDonHang.css";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";

function QuanLyDonHang() {
  const { refresh } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  return (
    <>
      <AdminNavBar />
      <div className="quanly-donhang" style={{ margin: "110px 50px" }}>
        <div className="ql-controls">
          <label className="ql-filter">
            Trạng thái:
            <select>
              <option value="all">Tất cả</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </label>
        </div>
        <table className="ql-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Người mua</th>
              <th>Ngày mua</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}
export default QuanLyDonHang;
