import { Link } from "react-router-dom";
import "./components-css/NavBar.css";
export default function UserNavBar() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <img src="rocket-icon.svg" alt="rocket 1h" class="navBar__img" />
            </Link>
          </li>
          <li>
            <Link to="/">
              <p>Trang chủ</p>
            </Link>
          </li>
          <li>
            <Link>
              <p>Khóa học</p>
            </Link>
          </li>
          <li>
            <Link>
              <p>🛒</p>
            </Link>
          </li>
          <li>
            <div>
              <input type="text" />
              <button>🔍</button>
            </div>
          </li>
          <li>
            <Link to="/login">
              <p>Đăng nhập</p>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
