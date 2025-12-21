import { useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";
import Footer from "./Footer";
import UserNavBar from "./UserNavBar";
import { useSearchParams } from "react-router-dom";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import "./components-css/OrderDetail.css";

export default function OrderDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { refresh } = useContext(AppContext);
  const [orderWithOrderId, setOrderWithOrderId] = useState("");
  useEffect(() => {
    if (id) {
      fetchAPI({
        url: `${url}/order?order_id=${id}`,
        setData: setOrderWithOrderId,
      });
    }
  }, [id, refresh]);
  return (
    <div className="page-layout">
      <UserNavBar />
      <div className="main-content">
        <div className="order-detail-container">
          <div className="order-detail-header">
            <h2>Chi tiết đơn hàng</h2>
          </div>
          {orderWithOrderId && (
            <>
              <div className="order-detail-status">Trạng thái: Success</div>
              {orderWithOrderId.fullName && (
                <div className="order-detail-info">
                  <h3>Thông tin khách hàng</h3>
                  <p>
                    <strong>Họ tên:</strong> {orderWithOrderId.fullName}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {orderWithOrderId.phone}
                  </p>
                </div>
              )}
              <table className="order-detail-table">
                <thead>
                  <tr>
                    <th>Khóa học</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {orderWithOrderId.items &&
                    orderWithOrderId.items.length > 0 &&
                    orderWithOrderId.items.map((value, index) => {
                      const image = value.courseId.image.includes("https")
                        ? value.courseId.image
                        : `http://localhost:3000/images/course/${value.courseId.image}`;
                      return (
                        <tr key={index}>
                          <td className="order-detail-course-cell">
                            <img
                              src={image}
                              alt=""
                              className="order-detail-course-image"
                            />
                            <div className="order-detail-course-info">
                              <p className="order-detail-course-name">
                                {value.courseName || value.courseId.title}
                              </p>
                            </div>
                          </td>
                          <td className="order-detail-price">
                            {value.coursePrice || value.courseId.price} VNĐ
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div className="order-detail-total">
                Tổng cộng: {orderWithOrderId.totalAmount} VNĐ
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
