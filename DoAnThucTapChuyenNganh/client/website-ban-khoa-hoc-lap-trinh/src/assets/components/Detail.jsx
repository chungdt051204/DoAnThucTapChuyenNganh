// import ReactPlayer from "react-player";
import { useEffect, useState, useContext, useRef } from "react";
import AppContext from "./AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./components-css/Detail.css";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";

export default function GetDetailCourse() {
  const navigate = useNavigate();
  const { user, isLogin } = useContext(AppContext); // useContext thông tin người dùng và trạng thái đăng nhập từ Context.
  const [searchParams] = useSearchParams(); // useSearch dùng để truy cập các tham số truy vấn (query string) trên URL.
  const id = searchParams.get("id"); // Lấy giá trị của tham số 'id' từ query string.
  const lesson_order = searchParams.get("lesson_order"); // Lấy giá trị của tham số 'lesson_order' từ query string.
  const [course, setCourse] = useState(""); // useState lưu trữ dữ liệu chi tiết của khóa học.
  const dialog = useRef();
  const lesson = course.lessons
    ? course.lessons.find((value) => value.order == lesson_order)
    : ""; //Tìm kiếm bài học ứng với thứ tự được chọn
  useEffect(() => {
    // Gọi API để lấy dữ liệu chi tiết khóa học, sử dụng ID lấy từ URL.
    fetch(`http://localhost:3000/course?id=${id}`)
      .then((res) => {
        if (res.ok) return res.json(); // Nếu thành công parse JSON.
        throw res; // Nếu thất bại, ném response để xử lý lỗi.
      })
      .then((data) => {
        setCourse(data); // Cập nhật state 'course' với dữ liệu chi tiết khóa học nhận được.
      });
  }, [id]); // Dependency array: useEffect sẽ chạy lại mỗi khi ID khóa học trên URL thay đổi.
  const handleClick = () => {
    // Kiểm tra Bắt buộc Đăng nhập
    if (!isLogin) {
      alert("Bạn chưa đăng nhập"); // Thông báo lỗi nếu chưa đăng nhập
      return; // Dừng hàm ngay lập tức
    }
    //  Kiểm tra Khóa học Miễn phí
    if (course.isFree == true) {
      return; // Dừng hàm vì không cần thêm khóa học miễn phí vào giỏ hàng
    }
    //  Gọi API Thêm vào Giỏ hàng
    fetch("http://localhost:3000/cart", {
      // Gửi yêu cầu POST đến endpoint /cart
      method: "POST",
      headers: {
        "Content-type": "application/json", // Chỉ định dữ liệu gửi đi là JSON
      },
      // Đóng gói dữ liệu cần thiết của khóa học và ID người dùng để thêm vào giỏ hàng
      body: JSON.stringify({
        userId: user._id,
        courseId: course._id,
        courseName: course.title,
        coursePrice: course.price,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu thành công parse JSON
        throw res; // Nếu thất bại, ném response để xử lý lỗi
      })
      .then((message) => {
        alert(message); // Hiển thị thông báo thành công từ server
      })
      .catch(async (err) => {
        // Xử lý lỗi (ví dụ: khóa học đã có trong giỏ hàng)
        const { message } = await err.json(); // Lấy thông báo lỗi chi tiết từ body response
        alert(message); // Hiển thị thông báo lỗi
      });
  };
  return (
    <>
      <UserNavBar></UserNavBar>
      <div className="course-card">
        <div className="course-hero">
          <img
            className="course-thumb"
            src={course.thumbnail}
            alt={course.title}
          />
          <div className="course-side">
            <div className="level">{course.title}</div>
            <div className="price">
              {course.price > 0 ? (
                <p>Giá: {course.price} VND</p>
              ) : (
                <p>Miễn phí</p>
              )}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#334a5e" }}>
              {course.totalLessons} bài học
            </div>
            <button onClick={handleClick}>
              {course.price > 0 ? <p>Thêm vào giỏ</p> : <p>Học ngay</p>}
            </button>
          </div>
        </div>
        <h2 className="course-title">{course.title}</h2>
        <div className="course-meta">{course.shortDescription || ""}</div>
        <div className="info-grid">
          <div className="info-card">
            <h3>Mô tả</h3>
            <p style={{ margin: 0 }}>{course.description}</p>
          </div>
          <div className="info-card">
            <div className="info-split">
              <div>
                <h3>Yêu cầu</h3>
                {course.requirements && course.requirements.length > 0 ? (
                  <ul>
                    {course.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có yêu cầu bắt buộc</p>
                )}
              </div>
              <div>
                <h3>Bạn sẽ học được</h3>
                {course.objectives && course.objectives.length > 0 ? (
                  <ul>
                    {course.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                ) : (
                  <p>-</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="lessons">
          <div className="lessons-title">Nội dung khóa học</div>
          {course.lessons &&
            course.lessons.length > 0 &&
            course.lessons.map((lesson, idx) => (
              <a
                key={idx}
                href={`#lesson-${idx}`}
                style={{ display: "block", marginBottom: 8 }}
              >
                <div
                  onClick={() => {
                    if (course.isFree === false) {
                      alert("Bạn chưa mua khóa học");
                      return;
                    } else {
                      navigate(`/course?id=${id}&lesson_order=${idx + 1}`);
                      dialog.current.showModal();
                    }
                  }}
                  className="lesson-item"
                >
                  <div className="lesson-left">
                    <div className="play">▶</div>
                    <div className="lesson-title">
                      <p>
                        {idx + 1}. {lesson.title}
                      </p>
                    </div>
                  </div>
                  <div className="lesson-time">
                    {lesson.duration || "00:00"}
                  </div>
                </div>
              </a>
            ))}
        </div>
      </div>
      <dialog ref={dialog} className="video-dialog">
        <div style={{ width: "700px", height: "350px", margin: "auto" }}>
          {/* <ReactPlayer
            width={700}
            height={350}
            src={lesson && lesson.videoUrl}
            controls="true"
          ></ReactPlayer> */}
        </div>
      </dialog>
      <Footer></Footer>
    </>
  );
}
