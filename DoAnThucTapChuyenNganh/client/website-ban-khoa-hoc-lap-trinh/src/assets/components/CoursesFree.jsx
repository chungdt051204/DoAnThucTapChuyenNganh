import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./components-css/CoursesFree.css";
export default function CoursesFree() {
  const [coursesFree, setCoursesFree] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/course-free")
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setCoursesFree(data);
      });
  }, []);
  return (
    <>
      <section className="course-free-component">
        <h2>Khóa học miễn phí</h2>
        <div className="course-free-track">
          {coursesFree.length > 0 ? (
            coursesFree.map((value, index) => {
              return (
                <div key={index} className="course-free-item">
                  <Link to={`/course/detail?id=${value._id}`}>
                    <img src={value.image} alt="" width={150} height={200} />
                  </Link>
                  <p>{value.title}</p>
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
