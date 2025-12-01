import { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import { useSearchParams } from "react-router-dom";
import "./components-css/Detail.css";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";

export default function GetDetailCourse() {
  const { user, isLogin } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [course, setCourse] = useState("");
  useEffect(() => {
    console.log(id);
    fetch(`http://localhost:3000/course/detail?id=${id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setCourse(data);
      });
  }, [id]);
  const handleClick = () => {
    if (!isLogin) {
      alert("Bạn chưa đăng nhập");
      return;
    }
    fetch("http://localhost:3000/addCart", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        courseId: course._id,
        courseName: course.title,
        coursePrice: course.price,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((message) => {
        alert(message);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        alert(message);
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
              {" "}
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
                <div className="lesson-item">
                  <div className="lesson-left">
                    <div className="play">▶</div>
                    <div className="lesson-title">
                      {idx + 1}. {lesson.title}
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

      <Footer></Footer>
    </>
  );
}
