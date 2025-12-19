import { useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";
import { useSearchParams } from "react-router-dom";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import "./components-css/CoursesWithQueryString.css";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
export default function CoursesWithQueryString({ text }) {
  const [searchParams] = useSearchParams();
  const category_id = searchParams.get("category_id");
  const search = searchParams.get("search");
  const { categories, refresh } = useContext(AppContext);
  const [coursesWithQueryString, setCoursesWithQueryString] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  useEffect(() => {
    if (category_id && categories.length > 0) {
      fetchAPI({
        url: `${url}/course?category_id=${category_id}`,
        setData: setCoursesWithQueryString,
      });
      const categoryWithId = categories.find(
        (value) => value._id === category_id
      );
      setCategoryName(categoryWithId.title);
    } else if (search) {
      fetchAPI({
        url: `${url}/course?search=${encodeURIComponent(search)}`,
        setData: setCoursesWithQueryString,
      });
    }
  }, [refresh, category_id, search, setCoursesWithQueryString, categories]);
  return (
    <>
      <UserNavBar />
      <div className="course-page">
        <div className="container">
          <header className="page-header">
            <div className="header-info">
              <h1 className="page-title">
                {text}
                <span className="title-highlight">
                  {category_id && categoryName}
                </span>
              </h1>
              <p className="page-count">
                {coursesWithQueryString.length} khóa học
              </p>
            </div>
          </header>

          <div className="course-list">
            {coursesWithQueryString.length > 0 ? (
              coursesWithQueryString.map((course, index) => (
                <div className="course-item" key={course._id || index}>
                  <div className="course-image">
                    <img
                      src={course.image}
                      alt={course.title}
                      width={150}
                      height={200}
                    />
                  </div>
                  <div className="course-body">
                    <h3 className="course-name">{course.title}</h3>
                    <div className="course-price">
                      {course.price > 0 ? (
                        `${course.price.toLocaleString()}đ`
                      ) : (
                        <span className="free">Miễn phí</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty">Không tìm thấy khóa học nào.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
