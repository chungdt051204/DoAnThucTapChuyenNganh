import "./components-css/CoursesWithQueryString.css";
import Footer from "./Footer";
import UserNavBar from "./UserNavBar";
export default function GetCoursesWithQueryString({ data }) {
  return (
    <>
      <div className="coursesWithQueryString-track">
        {data.length > 0 ? (
          data.map((value, index) => {
            return (
              <div className="coursesWithQueryString-item" key={index}>
                <img src={value.image} alt="" width={150} height={200} />
                <p>{value.title}</p>
              </div>
            );
          })
        ) : (
          <p>Không tìm thấy khóa học để hiển thị</p>
        )}
      </div>
    </>
  );
}
