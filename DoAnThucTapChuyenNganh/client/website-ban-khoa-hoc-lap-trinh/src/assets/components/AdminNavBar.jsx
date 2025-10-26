import { Link } from "react-router-dom";
import "./NavBar.css";
export default function AdminNavBar() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link>Logo</Link>
          </li>
          <li>
            <Link>Dashboard</Link>
          </li>
          <li>
            <Link>Quản lý khóa học</Link>
          </li>
          <li>
            <Link>Quản lý người dùng</Link>
          </li>
          <li>
            <button>Đăng xuất</button>
          </li>
        </ul>
      </nav>
    </>
  );
}
