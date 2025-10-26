import { Link } from "react-router-dom";
import "./components-css/main.css";
export default function UserNavBar() {
  return (
    <>
      <section class="navBar__section">
        <div class="container navBar__container">
          <img src="rocket-icon.svg" alt="rocket 1h" class="navBar__img" />
          <div class="navBar__item1">
            <a href="#">Trang chủ</a>
            <a href="#">Khóa học</a>
            <a href="#">🛒</a>
            <div>
              <input type="text" />
              <button>🔍</button>
            </div>
          </div>
          <div class="navBar__item2">
            <a href="#">Đăng nhập</a>
            <a href="#">Đăng ký</a>
          </div>
        </div>
      </section>
    </>
  );
}
