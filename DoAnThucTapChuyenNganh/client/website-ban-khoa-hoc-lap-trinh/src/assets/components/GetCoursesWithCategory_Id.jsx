import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GetCoursesWithQueryString from "./GetCoursesWithQueryString";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/Courses.List.css"; // <-- Mới: styles cho trang này

export default function GetCoursesWithCategory_Id() {
  const [searchParams] = useSearchParams();
  const category_id = searchParams.get("category_id");
  // State to hold the list of courses returned from the server
  const [coursesWithCategory_Id, setCoursesWithCategory_Id] = useState([]);
  // State to hold the human-readable category title (converted from id)
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/courses/category?category_id=${category_id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setCoursesWithCategory_Id(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [category_id]);

  // When a category_id is present, fetch the category object to display
  // its title instead of the raw id. The server exposes `GET /category?id=<id>`
  // (see server/modules/category/category.router.js -> getCategoryWithId).
  useEffect(() => {
    if (!category_id) {
      // No id provided -> clear categoryName
      setCategoryName("");
      return;
    }

    fetch(`http://localhost:3000/category?id=${category_id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((category) => {
        // The category object returned by the server includes a `title` field.
        // Save it for display; fall back to the raw id if title missing.
        setCategoryName(category && category.title ? category.title : "");
      })
      .catch((err) => {
        console.error("Failed to load category name:", err);
        setCategoryName("");
      });
  }, [category_id]);

  return (
    <>
      <UserNavBar />
      <main className="courses-list-page">
        <div className="container">
          <header className="courses-list-header">
            <div className="title-block">
              <h1 className="page-title">Khóa học theo danh mục</h1>
              <p className="category-sub">
                {/* Display the category title when available, otherwise show id or 'Tất cả' */}
                Danh mục:{" "}
                <strong>{categoryName || category_id || "Tất cả"}</strong>
              </p>
            </div>

            <div className="result-stats">
              <span className="count">{coursesWithCategory_Id.length}</span>
              <span className="label">khóa học tìm thấy</span>
            </div>
          </header>

          <section className="courses-list-content">
            {/* Reuse existing component: it should render the grid (cards) */}
            <GetCoursesWithQueryString data={coursesWithCategory_Id} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
