import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import UserNavBar from "../components/UserNavBar";
import Footer from "../components/Footer";
import "../styles/MyCourses.css";

export default function MyCourses() {
  const navigate = useNavigate();
  const { user, refresh, isLoading, isLogin } = useContext(AppContext);
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (!isLoading) {
      if (!isLogin) {
        navigate("/");
        return;
      }
    }
  }, [refresh, isLoading, isLogin, navigate]);

  useEffect(() => {
    if (user) {
      fetchAPI({
        url: `${url}/enrollment?user_id=${user._id}`,
        setData: setMyCourses,
      });
    }
  }, [refresh, user]);
  return (
    <div className="page-layout">
      <UserNavBar />
      <div className="main-content">
        <div className="my-courses-container">
          <div className="my-courses-header">
            <h2>Khóa học của tôi</h2>
          </div>
          <div className="my-courses-grid">
            {myCourses.length > 0 ? (
              myCourses.map((value) => {
                return (
                  <div key={value._id} className="my-courses-course-card">
                    <Link
                      to={`/course?id=${value.courseId._id}`}
                      className="my-courses-course-link"
                    >
                      <img
                        src={value.courseId.image}
                        alt=""
                        className="my-courses-course-image"
                      />
                    </Link>
                    <div className="my-courses-course-info">
                      <p className="my-courses-course-title">
                        {value.courseId.title}
                      </p>
                      <Link to={`/course?id=${value.courseId._id}`}>
                        <button className="my-courses-course-button">
                          Vào học ngay
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-message">
                Danh sách khóa học của bạn hiện tại đang trống
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
