import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "./AppContext";
import Footer from "./Footer";
import UserNavBar from "./UserNavBar";

export default function MyOrder() {
  const { user, refresh } = useContext(AppContext);
  const [myOrders, setMyOrders] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3000/orders?user_id=${user._id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        console.log(data);
        setMyOrders(data);
      })
      .catch();
  }, [user._id, refresh]);
  return (
    <>
      <UserNavBar />
      <h2>Đơn hàng của tôi</h2>
      <table border={1}>
        <tr>
          <th>Mã đơn hàng</th>
          <th>Ngày mua</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
        {myOrders.length > 0 &&
          myOrders.map((value, index) => {
            return (
              <tr key={index}>
                <td>{value._id}</td>
                <td>{value.updatedAt}</td>
                <td>{value.totalAmount}</td>
                <td>{value.status}</td>
                <td>
                  <Link to={`/my-orders/order-detail?id=${value._id}`}>
                    <button>Xem chi tiết</button>
                  </Link>
                </td>
              </tr>
            );
          })}
      </table>
      <Footer />
    </>
  );
}
