import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GetCoursesWithQueryString from "./GetCoursesWithQueryString";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/Courses.List.css";

export default function GetCoursesWithSearch() {
  const [coursesWithSearch, setCoursesWithSearch] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    fetch(`http://localhost:3000/courses/?search=${search}`)
      .then((res) => {
        // Kiểm tra xem response có thành công không .
        if (res.ok) return res.json(); // Nếu OK, chuyển đổi body thành JSON
        throw res; // Nếu không OK, ném toàn bộ response object để xử lý lỗi
      })
      // Xử lý dữ liệu JSON đã được parse từ response thành công.
      .then((data) => {
        console.log(data); // In dữ liệu ra console để kiểm tra
        // Cập nhật state coursesWithCategory_Id với dữ liệu khóa học nhận được.
        setCoursesWithSearch(data);
      })
      // Xử lý các lỗi
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message); // In thông báo lỗi ra console
      });
  }, [search]); // Mảng dependency: API sẽ được gọi lại mỗi khi giá trị của category_id thay đổi.
  return (
    <>
      <UserNavBar />
      <main className="courses-list-page">
        <div className="container">
          <header className="courses-list-header">
            <div className="title-block">
              <h1 className="page-title">
                Khóa học có chứa từ khóa tìm kiếm {search}
              </h1>
            </div>
            <div className="result-stats">
              <span className="count">{coursesWithSearch.length}</span>
              <span className="label">khóa học tìm thấy</span>
            </div>
          </header>
          <GetCoursesWithQueryString data={coursesWithSearch} />
        </div>
      </main>
      <Footer />
    </>
  );
}
