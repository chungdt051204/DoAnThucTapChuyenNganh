import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./components-css/Detail.css";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/Details.css";
export default function GetDetailCourse() {
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
  return (
    <>
      <UserNavBar></UserNavBar>
      {/* <div>
        <img src={course.thumbnail} alt="" width={800} height={400} />
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <p>Giá: {course.price}</p>
        <p>Tổng số bài học: {course.totalLessons}</p>
        <div>
          Yêu cầu:
          {course.requirements &&
            course.requirements.length > 0 &&
            course.requirements.map((value, index) => {
              return (
                <ul key={index}>
                  <li>{value}</li>
                </ul>
              );
            })}
        </div>

        <div>
          Bạn sẽ học được:
          {course.objectives &&
            course.objectives.length > 0 &&
            course.objectives.map((value, index) => {
              return (
                <ul key={index}>
                  <li>{value}</li>
                </ul>
              );
            })}
        </div>
        <div>
          Các bài học trong khóa học:
          {course.lessons &&
            course.lessons.length > 0 &&
            course.lessons.map((value, index) => {
              return (
                <div key={index}>
                  <Link>
                    <p>{value.title}</p>
                  </Link>
                </div>
              );
            })}
        </div>
      </div> */}

      <div className="course-card">
        <div className="course-hero">
          <img
            className="course-thumb"
            src={course.thumbnail}
            alt={course.title}
          />

          <div className="course-side">
            <div className="level">ReactJS cơ bản</div>
            <div className="price">Giá: {course.price} VND</div>
            <div style={{ fontSize: "0.85rem", color: "#334a5e" }}>
              {course.totalLessons} bài học
            </div>
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
                    <div className="lesson-title">{lesson.title}</div>
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
