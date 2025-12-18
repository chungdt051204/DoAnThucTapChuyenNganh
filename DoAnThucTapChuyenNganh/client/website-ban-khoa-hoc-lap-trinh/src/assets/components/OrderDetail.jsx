import { useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";
import Footer from "./Footer";
import UserNavBar from "./UserNavBar";
import { useSearchParams } from "react-router-dom";

export default function OrderDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { refresh } = useContext(AppContext);
  const [orderWithOrderId, setOrderWithOrderId] = useState("");
  useEffect(() => {
    fetch(`http://localhost:3000/orders?order_id=${id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        console.log(data);
        setOrderWithOrderId(data);
      })
      .catch();
  }, [id, refresh]);
  return (
    <>
      <UserNavBar />
      <h2>Lịch sử trạng thái</h2>
      {orderWithOrderId.status}
      <table border={1}>
        <tr>
          <th>Khóa học</th>
          <th>Giá</th>
        </tr>
        {orderWithOrderId &&
          orderWithOrderId.items.length > 0 &&
          orderWithOrderId.items.map((value, index) => {
            const image = value.courseId.image.includes("https")
              ? value.courseId.image
              : `http://localhost:3000/images/course/${value.courseId.image}`;
            return (
              <tr key={index}>
                <td>
                  <img src={image} alt="" width={80} height={100} />
                  <p>{value.courseName}</p>
                </td>
                <td>
                  <p>{value.coursePrice}</p>
                </td>
              </tr>
            );
          })}
      </table>
      <Footer />
    </>
  );
}
