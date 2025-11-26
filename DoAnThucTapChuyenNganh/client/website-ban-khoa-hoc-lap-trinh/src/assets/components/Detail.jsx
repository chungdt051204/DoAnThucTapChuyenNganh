import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./components-css/Detail.css";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
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
      <div>
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
      </div>
      <Footer></Footer>
    </>
  );
}
