import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import AppContext from "./AppContext";
import "./components-css/NavBar.css";
export default function UserNavBar() {
  const navigate = useNavigate(); // useNavigate dùng để điều hướng
  // Sử dụng Context để truy cập và quản lý các giá trị/hàm toàn cục của ứng dụng:
  const { user, isLogin, setIsLogin, categories } = useContext(AppContext);
  const [onClick, setOnClick] = useState(false); // useState quản lý trạng thái bật/tắt của một phần tử
  const [inputValue, setInputValue] = useState(""); // useState lưu trữ giá trị người dùng nhập vào ô tìm kiếm (dùng để kiểm soát input).
  const [coursesWithSearchSuggestion, setCoursesWithSearchSuggestion] =
    useState([]); // useState lưu trữ danh sách các khóa học được gợi ý dựa trên nội dung tìm kiếm.
  const inputRef = useRef(); // useRef dùng để tham chiếu trực tiếp đến phần tử input để lấy giá trị.
  const handleChange = () => {
    // Cập nhật state inputValue với giá trị hiện tại của ô input
    setInputValue(inputRef.current.value);
    // Gọi API Tìm kiếm Gợi ý
    fetch(
      // Gửi yêu cầu GET đến API
      `http://localhost:3000/courses/search/suggestion?title=${encodeURIComponent(
        inputRef.current.value
      )}`
    )
      .then((res) => {
        if (res.ok) return res.json(); // Nếu phản hồi thành công (2xx), chuyển đổi sang JSON
        throw res; // Nếu thất bại, ném response
      })
      .then((data) => {
        // Cập nhật state với dữ liệu danh sách khóa học được gợi ý nhận từ server
        setCoursesWithSearchSuggestion(data);
      });
  };
  const handleLogout = () => {
    // Gửi yêu cầu DELETE đến endpoint /me trên server
    fetch("http://localhost:3000/me", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Đảm bảo gửi kèm **cookie** (sessionId) để server biết session nào cần hủy
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu thành công (2xx), parse JSON
        throw res; // Nếu thất bại, ném response để xử lý lỗi
      })
      .then(({ message }) => {
        alert(message); // Hiển thị thông báo đăng xuất thành công
        setIsLogin(false); // Cập nhật trạng thái Context: người dùng không còn đăng nhập
        navigate("/"); // Chuyển hướng về trang chủ
      })
      .catch(async (err) => {
        // Xử lý lỗi (ví dụ: lỗi 401 nếu session đã hết hạn)
        if (err.status === 401) {
          const { message } = await err.json();
          console.log(message); // In lỗi từ server ra console
        }
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
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <div className="categories-dropdown">
              <Link to="#">
                <p onClick={() => setOnClick((prev) => !prev)}>Danh mục</p>
              </Link>
              {onClick && (
                <div className="categories-dropdown-menu">
                  {categories.length > 0 &&
                    categories.map((value, index) => {
                      return (
                        <div className="categories-dropdown-item" key={index}>
                          <Link
                            to={`/courses/category?category_id=${value._id}`}
                          >
                            <p>{value.title}</p>
                          </Link>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </li>
          <li>
            <i
              onClick={() => {
                if (!isLogin) {
                  alert("Bạn chưa đăng nhập");
                  return;
                } else {
                  navigate("/cart");
                }
              }}
              className="fa-solid fa-cart-shopping"
              style={{ cursor: "pointer" }}
            ></i>
          </li>
          <li className="search">
            <div className="search-dropdown">
              <div className="search-box">
                <input
                  onChange={handleChange}
                  ref={inputRef}
                  type="text"
                  placeholder="Nhập tên khóa học..."
                />
                <Link
                  to={`/courses/search?search=${encodeURIComponent(
                    inputValue
                  )}`}
                >
                  <i
                    style={{ cursor: "pointer" }}
                    className="fa-solid fa-magnifying-glass"
                  ></i>
                </Link>
              </div>
              {inputValue !== "" && (
                <div className="search-dropdown-menu">
                  {coursesWithSearchSuggestion.length > 0 ? (
                    coursesWithSearchSuggestion.map((value, index) => {
                      return (
                        <div className="search-dropdown-item" key={index}>
                          <img
                            src={value.image}
                            alt=""
                            width={60}
                            height={80}
                          />
                          <p>{value.title}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p>Không tìm thấy khóa học để hiển thị</p>
                  )}
                </div>
              )}
            </div>
          </li>
        </ul>
        <div className="auth">
          {isLogin ? (
            <div className="userProfile">
              <Link to="/profile">
                <img
                  src={
                    user && user.avatar && user.avatar.includes("https")
                      ? user.avatar
                      : user && user.avatar
                      ? `http://localhost:3000/images/user/${user.avatar}`
                      : ""
                  }
                  alt=""
                  width={50}
                  height={50}
                />
              </Link>
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
