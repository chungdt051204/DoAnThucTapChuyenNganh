import { Link } from "react-router-dom";
import "./components-css/NavBar.css";

export default function UserNavBar() {
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
          <Link to="/Login">Đăng nhập</Link>
          <Link to="/Register">Đăng ký</Link>
        </div>
      </nav>
    </>
  );
}
