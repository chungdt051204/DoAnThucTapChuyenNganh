import "./NavBar.css";
export default function UserNavBar() {
  return (
    <>
      <nav>
        <ul>
          <li>Logo</li>
          <li>Trang chủ</li>
          <li>Khóa học</li>
          <li>
            <div>
              <input type="text" />
              <button>Search</button>
            </div>
          </li>
          <li>Đăng nhập/ Đăng ký</li>
          <li>Icon giỏ hàng</li>
        </ul>
      </nav>
    </>
  );
}
