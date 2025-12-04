import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GetCoursesWithQueryString from "./GetCoursesWithQueryString";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/Courses.List.css"; // <-- Mới: styles cho trang này

export default function GetCoursesWithCategoryId() {
  // Khai báo một state variable và hàm setter để lưu trữ dữ liệu các khóa học
  // đã được lọc theo category_id. Giá trị khởi tạo là một mảng rỗng.
  const [coursesWithCategory_Id, setCoursesWithCategory_Id] = useState([]);
  // Sử dụng hook useSearchParams từ React Router (thường là v6)
  // để truy cập các tham số truy vấn (query string) trên
  const [searchParams] = useSearchParams();
  // Lấy giá trị của tham số 'category_id' từ query string.
  const category_id = searchParams.get("category_id");

  // Hook useEffect được sử dụng để thực hiện các side effect,
  // ở đây là gọi API fetch dữ liệu, sau khi component render lần đầu và mỗi khi dependency thay đổi.
  useEffect(() => {
    fetch(`http://localhost:3000/courses/?category_id=${category_id}`)
      .then((res) => {
        // Kiểm tra xem response có thành công không .
        if (res.ok) return res.json(); // Nếu OK, chuyển đổi body thành JSON
        throw res; // Nếu không OK, ném toàn bộ response object để xử lý lỗi
      })
      // Xử lý dữ liệu JSON đã được parse từ response thành công.
      .then((data) => {
        console.log(data); // In dữ liệu ra console để kiểm tra
        // Cập nhật state coursesWithCategory_Id với dữ liệu khóa học nhận được.
        setCoursesWithCategory_Id(data);
      })
      // Xử lý các lỗi
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message); // In thông báo lỗi ra console
      });
  }, [category_id]); // Mảng dependency: API sẽ được gọi lại mỗi khi giá trị của category_id thay đổi.

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
