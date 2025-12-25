import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppContext from "./AppContext";
import "./components-css/QuanLyDonHang.css";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import { fetchAPI } from "../service/api";
import { url } from "../../App";

function QuanLyDonHang() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status");
  const { orders, setOrders, refresh, setRefresh } = useContext(AppContext);
  const [statusSelected, setStatusSelected] = useState("");
  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    fetchAPI({
      url: `${url}/order?${params.toString()}`,
      setData: setOrders,
    });
  }, [refresh, status, setOrders]);
  //Hàm xử lý chọn trạng thái đơn hàng
  const handleStatusSelected = (value) => {
    setStatusSelected(value);
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (value) nextParams.set("status", value);
      else nextParams.delete("status");
      return nextParams;
    });
  };
  //Hàm xử lý xác nhận đơn hàng
  const handleConfirm = (order) => {
    const courseIds =
      order.items.length > 0 &&
      order.items.map((value) => {
        return value.courseId._id;
      });
    if (courseIds.length === 0) {
      alert("Đơn hàng này không có sản phẩm");
    } else {
      fetch(`${url}/order?id=${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: order.userId,
          courseIdWithOrderItem: courseIds,
        }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then(({ message }) => {
          console.log(message);
          setRefresh((prev) => !prev);
        })
        .catch(async (err) => {
          const { message } = await err.json();
          console.log(message);
        });
    }
  };
  return (
    <>
      <AdminNavBar />
      <div className="quanly-donhang" style={{ margin: "50px" }}>
        <select
          value={statusSelected}
          onChange={(e) => handleStatusSelected(e.target.value)}
          className="role-select"
          style={{ marginBottom: "20px" }}
        >
          <option value="">Chọn trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="success">Thành công</option>
        </select>
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
              <th>Hành động</th>
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
                    <td>
                      {new Date(value.createdAt).toLocaleDateString()} -
                      {new Date(value.createdAt).toLocaleTimeString()}
                    </td>
                    <td style={{ color: "red" }} className="font-bold">
                      {value.totalAmount} VNĐ
                    </td>
                    <td>
                      <span className={`status-label ${value.status}`}>
                        {value.status}
                      </span>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {value.status === "pending" && (
                        <button
                          className="btn-confirm-sm"
                          onClick={() => handleConfirm(value)}
                        >
                          Xác nhận
                        </button>
                      )}
                      <Link
                        to={`/admin/order/detail?id=${value._id}`}
                        className="order-detail-link"
                      >
                        <button className="btn-detail-sm">Xem chi tiết</button>
                      </Link>
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
