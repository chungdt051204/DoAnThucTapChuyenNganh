import { Link } from "react-router-dom";
import { useContext } from "react";
import AppContext from "./AppContext";
import "./components-css/CoursesFree.css";
export default function CoursesFree() {
  const { courses } = useContext(AppContext);
  return (
    <>
      <section className="course-free-component">
        <h2>Khóa học miễn phí</h2>
        <div className="course-free-track">
          {courses.length > 0 ? (
            courses.map((value, index) => {
              if (value.isFree) {
                return (
                  <div key={index} className="course-free-item">
                    <Link to={`/course?id=${value._id}`}>
                      <img src={value.image} alt="" width={150} height={200} />
                    </Link>
                    <p>{value.title}</p>
                  </div>
                );
              }
            })
          ) : (
            <p>Không có khóa học nào để hiển thị</p>
          )}
        </div>
      </section>
    </>
  );
}
