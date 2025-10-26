import { Link } from "react-router-dom";
import "./NavBar.css";
export default function UserNavBar() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link>Logo</Link>
          </li>
          <li>
            <Link>Trang chủ</Link>
          </li>
          <li>
            <Link>Khóa học</Link>
          </li>
          <li>
            <div>
              <input type="text" />
              <button>Search</button>
            </div>
          </li>
          <li>
            <button>Đăng nhập</button>
          </li>
          <li>
            <button>Icon giỏ hàng</button>
          </li>
        </ul>
      </nav>
    </>
  );
}
