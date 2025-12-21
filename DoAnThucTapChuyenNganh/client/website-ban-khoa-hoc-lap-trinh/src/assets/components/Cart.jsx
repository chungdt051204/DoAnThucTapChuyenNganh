import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "./AppContext";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/Cart.css";
import { fetchAPI } from "../service/api";
import { url } from "../../App";

export default function Cart() {
  const { user } = useContext(AppContext);
  const [myCart, setMyCart] = useState({ items: [] });
  const [cartItemSelected, setCartItemSelected] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const dialog = useRef();
  const fullNameRef = useRef();
  const phoneRef = useRef();
  let sum = 0;
  if (myCart?.items?.length > 0) {
    myCart?.items?.forEach((value) => {
      if (cartItemSelected.includes(value._id))
        sum += parseFloat(value.courseId.price);
    });
  }
  useEffect(() => {
    if (user) {
      fetchAPI({ url: `${url}/cart?user_id=${user._id}`, setData: setMyCart });
    }
  }, [user, refresh]);
  const handleChange = (id) => {
    // Nếu id khóa học chưa tồn tại trong mảng cartItemSelected => khóa học chưa được chọn
    //Thì thêm id khóa học vào mảng cartItemSelected
    if (!cartItemSelected.includes(id)) {
      setCartItemSelected([...cartItemSelected, id]);
    }
    //Nếu id khóa học đã tồn tại trong mảng cartItemSelected => bỏ chọn khóa học
    //Thì xóa id khóa học đó ra khỏi mảng cartItemSelected bằng phương thức filter trả về mảng mới không
    //lấy id khóa học đó
    else {
      const newArr = cartItemSelected.filter((value) => value != id);
      setCartItemSelected(newArr);
    }
  };
  const handleDelete = () => {
    fetch(`http://localhost:3000/cart?user_id=${user._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItemSelected: cartItemSelected }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        setCartItemSelected([]);
        alert(message);
        setRefresh((prev) => prev + 1);
      })
      .catch();
  };
  const handleOpenPurchaseDialog = () => {
    if (cartItemSelected.length == 0) {
      alert("Bạn chưa chọn khóa học cần mua");
      return;
    }
    dialog.current.showModal();
  };
  const handleSubmit = (e) => {
    const orderItemSelected = (myCart?.items || []).filter((value) =>
      cartItemSelected.includes(value._id)
    );
    e.preventDefault();
    fetch("http://localhost:3000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        fullName: fullNameRef.current.value,
        phone: phoneRef.current.value,
        orderItemSelected: orderItemSelected,
        totalAmount: sum,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
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
              {myCart?.items?.length > 0 &&
                myCart?.items?.map((value, index) => {
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
                            // checkbox được chọn là khi trong mảng cartItemSelected có chứa id của khóa học
                            checked={cartItemSelected.includes(value._id)}
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
                                {value.courseId.title}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="col-price">
                        <p style={{ color: "red" }}>{value.courseId.price}</p>
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
                        <span className="label">Tổng tiền:</span>
                        <p style={{ color: "red" }}>
                          {sum > 0 ? sum + " " + "VNĐ" : "0 VNĐ"}
                        </p>
                      </div>
                      <button
                        onClick={handleOpenPurchaseDialog}
                        className="btn-buy"
                      >
                        Mua hàng
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <dialog ref={dialog} className="cart-dialog">
          <div className="dialog-container">
            <h2 className="dialog-title">Xác nhận đơn hàng</h2>
            <form method="dialog" onSubmit={handleSubmit} className="cart-form">
              <div className="input-group">
                <input
                  type="text"
                  ref={fullNameRef}
                  placeholder="Họ và tên"
                  required
                />
                <input
                  type="text"
                  ref={phoneRef}
                  placeholder="Số điện thoại"
                  required
                />
              </div>
              <div className="table-container">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Khóa học</th>
                      <th style={{ textAlign: "right" }}>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myCart?.items?.map((value, index) => {
                      if (cartItemSelected.includes(value._id)) {
                        return (
                          <tr key={index}>
                            <td className="course-info">
                              <img src={value.courseId.image} alt="" />
                              <span>{value.courseId.title}</span>
                            </td>
                            <td className="price-cell">
                              {value.courseId.price.toLocaleString()}đ
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                  </tbody>
                </table>
              </div>
              <div className="total-box">
                <span>Tổng cộng:</span>
                <strong>{sum.toLocaleString()} VND</strong>
              </div>
              <div className="btn-group">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => dialog.current.close()}
                >
                  Hủy
                </button>
                <button className="btn-submit">Thanh toán ngay</button>
              </div>
            </form>
          </div>
        </dialog>
        <Footer />
      </section>
    </>
  );
}
