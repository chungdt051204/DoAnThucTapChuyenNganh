import React, { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import "./components-css/QuanLyDonHang.css";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";

function QuanLyDonHang() {
  const { refresh } = useContext(AppContext) || {};
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/orders", {
          credentials: "include",
        });
        if (!res.ok) throw res;
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn hàng", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [refresh]);

  const normalizeStatus = (status) => {
    if (typeof status === "boolean") return status ? "success" : "failed";
    if (!status) return "failed";
    const s = String(status).toLowerCase();
    if (["success", "completed", "paid", "true"].includes(s)) return "success";
    return "failed";
  };

  const filtered = orders.filter((order) => {
    if (filter === "all") return true;
    const s = normalizeStatus(order.status);
    return filter === "success" ? s === "success" : s === "failed";
  });

  const formatDate = (d) => {
    if (!d) return "";
    try {
      const date = new Date(d);
      return date.toLocaleString();
    } catch (e) {
      return String(d);
    }
  };

  return (
    <>
      <AdminNavBar />
      <div className="quanly-donhang" style={{ margin: "110px 50px" }}>
        <div className="ql-controls">
          <label className="ql-filter">
            Trạng thái:
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </label>
        </div>

        {loading ? (
          <p>Đang tải danh sách đơn hàng...</p>
        ) : (
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
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5">Không có đơn hàng</td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const id = order.code || order._id || order.id || "-";
                  const buyer =
                    order.user?.name || order.user?.email || order.user || "-";
                  const date = formatDate(order.createdAt || order.date);
                  const total =
                    typeof order.total === "number"
                      ? order.total.toLocaleString()
                      : order.total || "-";
                  const s = normalizeStatus(order.status);
                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{buyer}</td>
                      <td>{date}</td>
                      <td>{total}</td>
                      <td className={`ql-status ${s}`}>
                        {s === "success" ? "Thành công" : "Thất bại"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
}

export default QuanLyDonHang;
