import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "./AppContext";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import { fetchAPI } from "../service/api";
import { url } from "../../App";

export default function MyCourses() {
  const { user, refresh } = useContext(AppContext);
  const [myCourses, setMyCourses] = useState([]);
  useEffect(() => {
    if (user) {
      fetchAPI({
        url: `${url}/enrollment?user_id=${user._id}`,
        setData: setMyCourses,
      });
    }
  }, [user, refresh]);
  return (
    <>
      <UserNavBar />
      <h2>Khóa học của tôi</h2>
      <div style={{ display: "flex" }}>
        {myCourses.length > 0 ? (
          myCourses.map((value, index) => {
            const image = value.courseId.image.includes("https")
              ? value.courseId.image
              : `http://localhost:3000/images/course/${value.courseId.image}`;
            return (
              <div key={index}>
                <Link to={`/course?id=${value.courseId._id}`}>
                  <img src={image} alt="" width={150} height={200} />
                </Link>
                <p>{value.courseId.title}</p>
                <Link to={`/course?id=${value.courseId._id}`}>
                  <button>Vào học ngay</button>
                </Link>
              </div>
            );
          })
        ) : (
          <p>Danh sách khóa học của bạn hiện tại đang trống</p>
        )}
      </div>
      <Footer />
    </>
  );
}
