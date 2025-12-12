import React from "react";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/ThanhToan.css";

const ThanhToan = () => (
  <>
    <UserNavBar />

    <main className="tt-wrap">
      <div className="tt-box">
        <h2 className="tt-title">Nhập thông tin để thanh toán</h2>
        <p className="tt-sub">
          Nhập thông tin ngân hàng hoặc quét QR. Đảm bảo thông tin chính xác.
        </p>

        <div className="tt-content">
          <div className="qr">
            <img
              src="../../public/thanhtoan.jpg"
              alt="QR code"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="info">
            <div className="row">
              <span className="label">Số tài khoản</span>
              <strong className="value">1032284124</strong>
            </div>

            <div className="row">
              <span className="label">Tên tài khoản</span>
              <strong className="value">PHAM QUOC TIEN</strong>
            </div>

            <div className="row">
              <span className="label">Nội dung</span>
              <span className="value">Mã số học viên + Mã thanh toán</span>
            </div>
          </div>
        </div>

        <p className="note">
          Lưu ý: Nếu đơn hàng không tự động kích hoạt sau chuyển khoản, vui lòng
          liên hệ hỗ trợ.
        </p>
      </div>
    </main>

    <Footer />
  </>
);

export default ThanhToan;
