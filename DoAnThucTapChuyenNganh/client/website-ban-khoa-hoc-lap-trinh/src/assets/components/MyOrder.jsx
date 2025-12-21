import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "./AppContext";
import Footer from "./Footer";
import UserNavBar from "./UserNavBar";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import "./components-css/MyOrder.css";

export default function MyOrder() {
  const { user, refresh } = useContext(AppContext);
  const [myOrders, setMyOrders] = useState([]);
  useEffect(() => {
    if (user) {
      fetchAPI({
        url: `${url}/order?user_id=${user._id}`,
        setData: setMyOrders,
      });
    }
  }, [user, refresh]);
  return (
    <div className="page-layout">
      <UserNavBar />
      <div className="main-content">
        <div className="my-orders-container">
          <div className="my-orders-header">
            <h2>Đơn hàng của tôi</h2>
          </div>
          {myOrders.length > 0 ? (
            <table className="my-orders-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày mua</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td className="my-orders-order-id">{value._id}</td>
                      <td className="my-orders-date">
                        {new Date(value.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="my-orders-total">
                        {value.totalAmount} VNĐ
                      </td>
                      <td>
                        <span className="my-orders-status">{value.status}</span>
                      </td>
                      <td className="my-orders-action">
                        <Link to={`/my-orders/detail?id=${value._id}`}>
                          <button>Xem chi tiết</button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="my-orders-empty">Bạn chưa có đơn hàng nào.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
