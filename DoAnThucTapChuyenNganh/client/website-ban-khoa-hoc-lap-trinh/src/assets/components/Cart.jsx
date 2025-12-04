import { useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/Cart.css";

export default function Cart() {
  const { user } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [orderItemsSelected, setOrderItemsSelected] = useState([]);
  const [refresh, setRefresh] = useState(0);
  let sum = 0;
  {
    cartItems.forEach((value) => {
      sum = sum + parseFloat(value.priceAtPurchase.$numberDecimal);
      return sum;
    });
  }
  useEffect(() => {
    fetch(`http://localhost:3000/cart?user_id=${user._id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        console.log(data);
        setCartItems(data);
      });
  }, [user._id, refresh]);
  const handleChange = (id) => {
    // Nếu id khóa học chưa tồn tại trong mảng orderItemsSelected => khóa học chưa được chọn
    //Thì thêm id khóa học vào mảng orderItemsSelected
    if (!orderItemsSelected.includes(id)) {
      setOrderItemsSelected([...orderItemsSelected, id]);
    }
    //Nếu id khóa học đã tồn tại trong mảng orderItemsSelected => bỏ chọn khóa học
    //Thì xóa id khóa học đó ra khỏi mảng orderItemsSelected bằng phương thức filter trả về mảng mới không
    //lấy id khóa học đó
    else {
      const newArr = orderItemsSelected.filter((value) => value != id);
      setOrderItemsSelected(newArr);
    }
  };
  const handleDelete = () => {
    fetch("http://localhost:3000/cart-items", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderIdItemsSelected: orderItemsSelected }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        setOrderItemsSelected([]);
        setRefresh((prev) => prev + 1);
        alert(message);
      })
      .catch();
  };
  return (
    <>
      <section>
        <UserNavBar />
        <div className="cart" style={{ margin: "100px 50px" }}>
          <table className="cart-table">
            <thead>
              <tr>
                <th className="col-product">Sản Phẩm</th>
                <th className="col-price">Đơn Giá</th>
                <th className="col-action">Thao Tác</th>
              </tr>
            </thead>

            <tbody>
              {/* Row 1 */}
              {cartItems.length > 0 &&
                cartItems.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td className="col-product">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          {/* khi thiết lập sự kiện onChange cho checkbox cần phải có thuộc tính checked để kiểm tra true/false */}
                          {/* Checked chỉ đúng khi checkbox đc chọn */}
                          <input
                            type="checkbox"
                            // checkbox được chọn là khi trong mảng onItemsSelected có chứa id của khóa học
                            checked={orderItemsSelected.includes(value._id)}
                            onChange={() => handleChange(value._id)}
                          />
                          <div className="product-cell">
                            <div className="product-thumb">
                              <img
                                src={value.courseId.image}
                                alt=""
                                width={64}
                                height={64}
                              />
                            </div>
                            <div className="product-info">
                              <div className="product-name">
                                {value.courseName}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="col-price">
                        <p style={{ color: "red" }}>
                          {value.priceAtPurchase.$numberDecimal} VND
                        </p>
                      </td>

                      <td className="col-action">
                        <a style={{ color: "red" }}>Xóa</a>
                      </td>
                    </tr>
                  );
                })}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan="5">
                  <div className="footer-row">
                    <div className="left-actions">
                      <label>
                        <input type="checkbox" /> Chọn tất cả
                      </label>
                      <button onClick={handleDelete} className="btn-plain">
                        Xóa
                      </button>
                    </div>

                    <div className="right-summary">
                      <div className="total">
                        <span className="label">Tổng cộng sản phẩm:</span>
                        <p className="amount">{sum} VND</p>
                      </div>
                      <button className="btn-buy">Mua Hàng</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <Footer />
      </section>
    </>
  );
}
