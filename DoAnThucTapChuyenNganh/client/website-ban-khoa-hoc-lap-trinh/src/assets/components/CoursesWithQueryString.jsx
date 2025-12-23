import { useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";
import { useSearchParams } from "react-router-dom";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import "./components-css/CoursesWithQueryString.css";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import PriceFilter from "./PriceFilter";
export default function CoursesWithQueryString({ text }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const category_id = searchParams.get("category_id");
  const search = searchParams.get("search");
  const priceRange = searchParams.get("price");
  const { categories, refresh } = useContext(AppContext);
  const [coursesWithQueryString, setCoursesWithQueryString] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [priceSelected, setPriceSelected] = useState("");
  useEffect(() => {
    const params = new URLSearchParams();
    if (category_id) {
      params.append("category_id", category_id);
      //Lấy ra tên danh mục được chọn
      const title =
        categories.length > 0 &&
        categories.map((value) => {
          if (value._id === category_id) return value.title;
        });
      setCategoryName(title);
    }
    if (search) params.append("search", search);
    if (priceRange) params.append("price", priceRange);
    fetchAPI({
      url: `${url}/course?${params.toString()}`,
      setData: setCoursesWithQueryString,
    });
  }, [
    refresh,
    category_id,
    search,
    priceRange,
    setCoursesWithQueryString,
    categories,
  ]);
  const handlePriceChange = (value) => {
    setPriceSelected(value);
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (value) nextParams.set("price", value);
      else nextParams.delete("price");
      return nextParams;
    });
  };
  return (
    <>
      <UserNavBar />
      <div className="course-page">
        <div className="container">
          <PriceFilter
            selectedValue={priceSelected}
            onPriceChange={handlePriceChange}
          />
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
