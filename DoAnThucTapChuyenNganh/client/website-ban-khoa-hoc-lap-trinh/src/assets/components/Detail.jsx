import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import AppContext from "./AppContext";
import { toast } from "react-toastify";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import UserNavBar from "./UserNavBar";
import ReactPlayer from "react-player";
import Footer from "./Footer";
import "./components-css/Detail.css";

export default function GetDetailCourse() {
  const navigate = useNavigate();
  const { user, isLogin, refresh, setRefresh } = useContext(AppContext); // useContext thông tin người dùng và trạng thái đăng nhập từ Context.
  const [searchParams] = useSearchParams(); // useSearchParams dùng để truy cập các tham số truy vấn (query string) trên URL.
  const id = searchParams.get("id"); // Lấy giá trị của tham số 'id' từ query string.
  const lesson_order = searchParams.get("lesson_order"); // Lấy giá trị của tham số 'lesson_order' từ query string.
  const [course, setCourse] = useState(""); // useState lưu trữ dữ liệu chi tiết của khóa học.
  const dialog = useRef();
  const comment = useRef();
  const [courseIdInCart, setCourseIdInCart] = useState([]);
  const [courseIdInEnrollment, setCourseIdInEnrollment] = useState([]);
  const [commentsInCourse, setCommentsInCourse] = useState([]);

  const lesson = course.lessons
    ? course.lessons.find((value) => value.order == lesson_order)
    : ""; //Tìm kiếm bài học ứng với thứ tự được chọn

  useEffect(() => {
    fetchAPI({ url: `${url}/course?id=${id}`, setData: setCourse });
  }, [id]);
  useEffect(() => {
    if (user) {
      // Gọi API để lấy dữ liệu chi tiết khóa học, sử dụng ID lấy từ URL.
      fetch(`http://localhost:3000/cart?user_id=${user._id}`)
        .then((res) => {
          if (res.ok) return res.json(); // Nếu thành công parse JSON.
          throw res; // Nếu thất bại, ném response để xử lý lỗi.
        })
        .then(({ data }) => {
          console.log(data);
          setCourseIdInCart(
            data !== null &&
              data.items.length &&
              data.items.map((value) => {
                return value.courseId._id;
              })
          );
          // Cập nhật state 'course' với dữ liệu chi tiết khóa học nhận được.
        });
    }
  }, [user, refresh]);
  useEffect(() => {
    if (user) {
      // Gọi API để lấy dữ liệu chi tiết khóa học, sử dụng ID lấy từ URL.
      fetch(`http://localhost:3000/enrollment?user_id=${user._id}`)
        .then((res) => {
          if (res.ok) return res.json(); // Nếu thành công parse JSON.
          throw res; // Nếu thất bại, ném response để xử lý lỗi.
        })
        .then(({ data }) => {
          console.log(data);
          setCourseIdInEnrollment(
            data.length &&
              data.map((value) => {
                return value.courseId._id;
              })
          );
          // Cập nhật state 'course' với dữ liệu chi tiết khóa học nhận được.
        });
    }
  }, [user, refresh]);
  useEffect(() => {
    fetchAPI({
      url: `${url}/review?course_id=${course._id}`,
      setData: setCommentsInCourse,
    });
  }, [refresh, course._id]);

  //Hàm xử lý thêm vào giỏ hàng
  const handleAddCart = () => {
    // Kiểm tra Bắt buộc Đăng nhập
    if (!isLogin) {
      toast.warning("Bạn chưa đăng nhập"); // Thông báo lỗi nếu chưa đăng nhập
      return; // Dừng hàm ngay lập tức
    }
    //  Gọi API Thêm vào Giỏ hàng
    fetch("http://localhost:3000/cart", {
      // Gửi yêu cầu POST đến endpoint /cart
      method: "POST",
      headers: {
        "Content-type": "application/json", // Chỉ định dữ liệu gửi đi là JSON
      },
      // Đóng gói dữ liệu cần thiết của khóa học và ID người dùng để thêm vào giỏ hàng
      body: JSON.stringify({
        userId: user._id,
        courseId: course._id,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu thành công parse JSON
        throw res; // Nếu thất bại, ném response để xử lý lỗi
      })
      .then(({ message }) => {
        setRefresh((prev) => prev + 1);
        toast.success(message);
        // Hiển thị thông báo thành công từ server
      })
      .catch(async (err) => {
        // Xử lý lỗi
        const { message } = await err.json(); // Lấy thông báo lỗi chi tiết từ body response
        console.log(message); // Hiển thị thông báo lỗi
      });
  };
  //Hàm xử lý đăng ký học khóa học miễn phí
  const handleEnrollFree = () => {
    fetch(`${url}/enrollment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        courseId: course._id,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };
  //Hàm xử lý đăng bình luận
  const handlePostComment = () => {
    if (!isLogin) {
      toast.warning("Bạn chưa đăng nhập, không thể bình luận");
      return;
    } else if (
      courseIdInEnrollment.length > 0 &&
      !courseIdInEnrollment.includes(course._id)
    ) {
      toast.warning("Bạn chưa sở hữu khóa học này, không thể bình luận");
      return;
    } else {
      if (comment.current.value !== "") {
        fetch(`${url}/review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            courseId: course._id,
            comment: comment.current.value,
          }),
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw res;
          })
          .then(({ message }) => {
            console.log(message);
            comment.current.value = "";
            setRefresh((prev) => prev + 1);
          })
          .catch(async (err) => {
            const { message } = await err.json();
            console.log(message);
          });
      }
    }
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
              {course.price > 0 ? (
                <p>Giá: {course.price} VND</p>
              ) : (
                <p style={{ color: "#16a34a" }}>Miễn phí</p>
              )}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#334a5e" }}>
              {course.totalLessons} bài học
            </div>
            {/* Bước 1: Kiểm tra xem đã sở hữu khóa học chưa (Bất kể phí hay miễn phí) */}
            {courseIdInEnrollment.length > 0 &&
            courseIdInEnrollment.includes(course._id) ? (
              <button className="btn-course btn-activated" disabled>
                <i className="fas fa-check-circle"></i> Đã kích hoạt
              </button>
            ) : (
              /* Bước 2: Nếu chưa sở hữu, kiểm tra xem là khóa học miễn phí hay trả phí */
              <>
                {course.isFree ? (
                  /* Nếu miễn phí: Cho nút Đăng ký ngay để lưu vào Enrollment */
                  <button
                    className="btn-course btn-primary"
                    onClick={handleEnrollFree}
                  >
                    Đăng ký học ngay
                  </button>
                ) : (
                  /* Nếu trả phí: Kiểm tra giỏ hàng */
                  <>
                    {courseIdInCart.length > 0 &&
                    courseIdInCart.includes(course._id) ? (
                      <button className="btn-course btn-in-cart" disabled>
                        <i className="fas fa-shopping-cart"></i> Đã trong giỏ
                      </button>
                    ) : (
                      <button
                        className="btn-course btn-primary"
                        onClick={handleAddCart}
                      >
                        Thêm vào giỏ
                      </button>
                    )}
                  </>
                )}
              </>
            )}
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
                style={{ display: "block", marginBottom: "8px" }}
              >
                <div
                  onClick={() => {
                    if (
                      courseIdInEnrollment.length > 0 &&
                      !courseIdInEnrollment.includes(course._id)
                    ) {
                      toast.warning("Bạn chưa sở hữu khóa học");
                      return;
                    } else {
                      navigate(`/course?id=${id}&lesson_order=${idx + 1}`);
                      dialog.current.showModal();
                    }
                  }}
                  className="lesson-item"
                >
                  <div className="lesson-left">
                    <div className="play">▶</div>
                    <div className="lesson-title">
                      <p>
                        {idx + 1}. {lesson.title}
                      </p>
                    </div>
                  </div>
                  <div className="lesson-time">
                    {lesson.duration || "00:00"}
                  </div>
                </div>
              </a>
            ))}
        </div>
        <div className="detail-comment-section">
          <h3 className="detail-comments-title">Các bình luận</h3>
          <div className="detail-comment-input-container">
            <input
              type="text"
              ref={comment}
              className="detail-comment-input"
              placeholder="Viết bình luận của bạn..."
              required
            />
            <button
              onClick={handlePostComment}
              className="detail-comment-button"
            >
              Gửi
            </button>
          </div>
          <div className="detail-comment-list">
            {commentsInCourse.length > 0 &&
              commentsInCourse.map((value, index) => {
                const image = value.userId.avatar.includes("https")
                  ? value.userId.avatar
                  : `http://localhost:3000/images/user/${value.userId.avatar}`;
                return (
                  <div key={index} className="detail-comment-item">
                    <img
                      src={image}
                      alt={value.userId.username}
                      className="detail-comment-avatar"
                    />
                    <div className="detail-comment-body">
                      <p className="detail-comment-username">
                        {value.userId.username}
                      </p>
                      <p className="detail-comment-text">{value.comment}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <dialog ref={dialog} className="video-dialog">
        <div style={{ width: "700px", height: "350px", margin: "auto" }}>
          <ReactPlayer
            width={700}
            height={350}
            src={lesson && lesson.videoUrl}
            controls="true"
          ></ReactPlayer>
        </div>
      </dialog>
      <Footer></Footer>
    </>
  );
}
