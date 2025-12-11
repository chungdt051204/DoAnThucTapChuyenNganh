import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "./AppContext";
import "./components-css/Auth.css";
import { useRef, useState } from "react";
import LoginGoogle from "./LoginGoogle";
export default function Login() {
  // useNavigate để điều hướng
  const navigate = useNavigate();
  // Sử dụng useContext để lấy hàm cập nhật trạng thái đăng nhập và thông tin người dùng
  const { setIsLogin, setUser } = useContext(AppContext);
  // useState lưu trữ và hiển thị thông báo lỗi đăng nhập
  const [loginNotValid, setLoginNotValid] = useState("");
  // useRef để tham chiếu đến các giá trị input (Email và Mật khẩu)
  const email = useRef();
  const password = useRef();
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn form submit mặc định
    // Kiểm tra validation client: bắt buộc điền đầy đủ thông tin
    if (email.current.value === "" || password.current.value === "") {
      setLoginNotValid("Vui lòng điền đầy đủ thông tin");
      return; // Dừng nếu thiếu thông tin
    } else {
      // Gọi API POST đến server để đăng nhập
      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Chỉ định kiểu dữ liệu gửi đi là JSON
        },
        // Đóng gói dữ liệu email và password thành chuỗi JSON
        body: JSON.stringify({
          email: email.current.value,
          password: password.current.value,
        }),
        credentials: "include", // Đảm bảo gửi kèm cookies/session
      })
        .then((res) => {
          if (res.ok) return res.json(); // Nếu thành công parse JSON
          throw res; // Nếu thất bại, ném response để xử lý lỗi
        })
        .then((data) => {
          setUser(data.user); // Lưu thông tin người dùng vào Context
          // Kiểm tra trạng thái tài khoản
          if (data.user.status === "banned") {
            // Nếu bị cấm (banned), hiển thị lỗi và dừng
            setLoginNotValid("Tài khoản này đã bị vô hiệu hóa");
            return;
          } else {
            // Nếu OK: báo thành công, cập nhật trạng thái đăng nhập
            alert(data.message);
            setIsLogin(true); // Điều hướng: Admin -> /admin, User -> /
            navigate(data.user.role === "admin" ? "/admin" : "/");
          }
        })
        .catch(async (err) => {
          // Xử lý lỗi từ server (thường là 401 - Unauthorized)
          if (err.status === 401) {
            // Lấy thông báo lỗi cụ thể từ body response
            const { message } = await err.json();
            setLoginNotValid(message); // Hiển thị lỗi (vd: Sai mật khẩu)
          }
        });
    }
  };
  return (
    <div className="auth-page">
      <div className="formAuth">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              ref={email}
              placeholder=" "
              onChange={() => setLoginNotValid("")}
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              ref={password}
              placeholder=" "
              onChange={() => setLoginNotValid("")}
            />
            <label htmlFor="password">Password</label>
          </div>
          {loginNotValid && <span>{loginNotValid}</span>}
          <button>Login</button>
        </form>
        <LoginGoogle />
        <p>
          Chưa có tài khoản? <Link to="/Register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
