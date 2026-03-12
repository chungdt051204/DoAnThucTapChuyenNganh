import { Link } from "react-router-dom";
import { useContext } from "react";
import AppContext from "./AppContext";
import "../styles/CoursesPre.css";

export default function CoursesPre() {
  const { courses } = useContext(AppContext);
  return (
    <>
      <section
        className="course-pre-component"
        style={{ marginTop: "50px", marginBottom: "100px" }}
      >
        <h2>Khóa học trả phí</h2>
        <div className="course-pre-track">
          {courses?.docs?.length > 0 ? (
            courses?.docs?.map((value) => {
              if (!value.isFree) {
                return (
                  <div key={value._id} className="course-pre-item">
                    <Link to={`/course?id=${value._id}`}>
                      <img src={value.image} alt="" width={150} height={200} />
                    </Link>
                    <p>{value.title}</p>
                    <p className="price">{value.price} VNĐ</p>
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
