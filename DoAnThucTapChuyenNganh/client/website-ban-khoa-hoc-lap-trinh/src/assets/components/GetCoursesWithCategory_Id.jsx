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

  useEffect(() => {
    fetch(`http://localhost:3000/courses/category?category_id=${category_id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        console.log(data);
        setCoursesWithCategory_Id(data);
      })
      .catch((err) => {
        console.error(err);
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
            </div>

            <div className="result-stats">
              <span className="count">{coursesWithCategory_Id.length}</span>
              <span className="label">khóa học tìm thấy</span>
            </div>
          </header>
          <GetCoursesWithQueryString data={coursesWithCategory_Id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
