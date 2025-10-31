import { Link } from "react-router-dom";
import { useContext } from "react";
import AppContext from "./AppContext";
import "./components-css/NavBar.css";

export default function UserNavBar() {
  const { user, isLogin, setIsLogin } = useContext(AppContext);
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
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
      });
  };
  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src="rocket-icon.svg" alt="Logo" />
        </div>

        <ul className="menu">
          <li>
            <Link to="#">Trang chủ</Link>
          </li>
          <li>
            <Link to="#">Khóa học</Link>
          </li>
          <li>
            <Link to="#">
              <i className="fas fa-shopping-cart">🛒</i>
            </Link>
          </li>
          <li>
            <div className="search-box">
              <input type="text" placeholder="Tìm kiếm..." />
              <button>
                <i className="fas fa-search">🔍</i>
              </button>
            </div>
          </li>
        </ul>
        <div className="auth">
          {isLogin ? (
            <div className="userProfile">
              <img
                src={
                  user && user.avatar.includes("https")
                    ? user.avatar
                    : `http://localhost:3000/${user.avatar}`
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
