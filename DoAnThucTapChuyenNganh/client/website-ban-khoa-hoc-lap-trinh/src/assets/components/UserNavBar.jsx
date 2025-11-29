import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import AppContext from "./AppContext";
import "./components-css/NavBar.css";

export default function UserNavBar() {
  const { user, isLogin, setIsLogin, categories } = useContext(AppContext);
  const [onClick, setOnClick] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [coursesWithSearchSuggestion, setCoursesWithSearchSuggestion] =
    useState([]);
  const inputRef = useRef();
  const handleChange = () => {
    setInputValue(inputRef.current.value);
    fetch(
      `http://localhost:3000/courses/search/suggestion?title=${encodeURIComponent(
        inputRef.current.value
      )}`
    )
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setCoursesWithSearchSuggestion(data);
      });
  };
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
          <li className="search">
            <div className="search-dropdown">
              <div className="search-box">
                <input
                  onChange={handleChange}
                  ref={inputRef}
                  type="text"
                  placeholder="Nhập tên khóa học..."
                />
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
