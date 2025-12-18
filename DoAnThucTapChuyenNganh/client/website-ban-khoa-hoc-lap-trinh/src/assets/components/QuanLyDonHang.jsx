import React, { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import "./components-css/QuanLyDonHang.css";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";

function QuanLyDonHang() {
  const { refresh } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/orders")
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setOrders(data);
      })
      .catch();
  });
  return (
    <>
      <AdminNavBar />
      <div className="quanly-donhang" style={{ margin: "110px 50px" }}>
        {/* <div className="ql-controls">
          <label className="ql-filter">
            Trạng thái:
            <select>
              <option value="all">Tất cả</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </label>
        </div> */}
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Người mua</th>
              <th>Số điện thoại</th>
              <th>Phương thức thanh toán</th>
              <th>Ngày mua</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((value, index) => {
                return (
                  <tr key={index}>
                    <td className="font-code">{value._id}</td>
                    <td>{value.fullName}</td>
                    <td>{value.phone}</td>
                    <td>{value.paymentMethod}</td>
                    <td>{value.createdAt}</td>
                    <td style={{ color: "red" }} className="font-bold">
                      {value.totalAmount}
                    </td>
                    <td>
                      <span className={`status-label ${value.status}`}>
                        {value.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}
export default QuanLyDonHang;
