import { useContext, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppContext from "./AppContext";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/Cart.css";

export default function Cart() {
  const { orders } = useContext(AppContext);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

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
                <th className="col-qty">Số Lượng</th>
                <th className="col-total">Số Tiền</th>
                <th className="col-action">Thao Tác</th>
              </tr>
            </thead>

            <tbody>
              {/* Row 1 */}
              <tr>
                <td className="col-product">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <input type="checkbox" />
                    <div className="product-cell">
                      <div className="product-thumb">Ảnh</div>
                      <div className="product-info">
                        <div className="product-name">Sản phẩm A</div>
                        <div style={{ fontSize: "13px", color: "#888" }}>
                          Mã SP: SP001
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="col-price">₫ 120.000</td>

                <td className="col-qty">
                  <div className="qty">
                    <button>−</button>
                    <input type="number" value="1" readOnly />
                    <button>+</button>
                  </div>
                </td>

                <td className="col-total">₫ 120.000</td>

                <td className="col-action">
                  <a className="action-delete" href="#">
                    Xóa
                  </a>
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td colSpan="5">
                  <div className="footer-row">
                    <div className="left-actions">
                      <label>
                        <input type="checkbox" /> Chọn tất cả
                      </label>
                      <button className="btn-plain">Xóa</button>
                    </div>

                    <div className="right-summary">
                      <div className="total">
                        <span className="label">Tổng cộng sản phẩm:</span>
                        <span className="amount">₫ 120.000</span>
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
