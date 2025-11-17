import { useEffect, useState } from "react";
import "./components-css/CoursesPre.css";
export default function CoursesPre() {
  const [coursesPre, setCoursesPre] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/course-pre")
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setCoursesPre(data);
      });
  }, []);
  return (
    <>
      <section className="course-pre-component">
        <h2>Khóa học trả phí</h2>
        <div className="course-pre-track">
          {coursesPre.length > 0 ? (
            coursesPre.map((value, index) => {
              return (
                <div key={index} className="course-pre-item">
                  <img src={value.image} alt="" width={150} height={200} />
                  <p>{value.title}</p>
                  <p style={{ color: "red" }}>{value.price}</p>
                </div>
              );
            })
          ) : (
            <p>Không có khóa học nào để hiển thị</p>
          )}
        </div>
      </section>
    </>
  );
}
