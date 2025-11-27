import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import "./components-css/NavBar.css";
import AppContext from "./AppContext";
export default function AdminNavBar() {
  const navigate = useNavigate();
  const { isLogin, setIsLogin, user } = useContext(AppContext);
  const handleLogout = () => {
    setIsLogin(false);
    fetch("http://localhost:3000/me", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(({ message }) => {
        alert(message);
        navigate("/");
      });
  };
  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src="/rocket-icon.svg" alt="Logo" />
        </div>

        <ul className="menu">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="#">
              <p>Quản lý danh mục</p>
            </Link>
          </li>
          <li>
            <Link to="#">
              <p>Quản lý khóa học</p>
            </Link>
          </li>
          <li>
            <Link to="#">
              <p>Quản lý người dùng</p>
            </Link>
          </li>
          <li>
            <Link to="#">
              <p>Quản lý đơn hàng</p>
            </Link>
          </li>
        </ul>
        <div className="auth">
          {isLogin ? (
            <div className="userProfile">
              <img
                src={
                  user && user.avatar.includes("https")
                    ? user.avatar
                    : `http://localhost:3000/images/${user.avatar}`
                }
                alt=""
                width={50}
                height={50}
              />
              <Link onClick={handleLogout}>Đăng xuất</Link>
            </div>
          ) : (
            <Link to="/login">Đăng nhập</Link>
          )}
        </div>
      </nav>
    </>
  );
}
