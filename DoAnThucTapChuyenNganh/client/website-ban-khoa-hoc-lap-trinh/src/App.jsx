import { Routes, Route } from "react-router-dom";
import AppContext from "./assets/components/AppContext";
import HomeUser from "./assets/components/HomeUser";
import Login from "./assets/components/Login";
import Register from "./assets/components/Register";
import { useEffect, useState } from "react";
import Instructor from "./assets/components/Instructors";
import GetDetailCourse from "./assets/components/Detail";
import GetCoursesWithCategory_Id from "./assets/components/GetCoursesWithCategory_Id";
import HomeAdmin from "./assets/components/HomeAdmin";
import QuanLyDanhMuc from "./assets/components/QuanLyDanhMuc";

function App() {
  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setIsLogin(true);
        setUser(data);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:3000/courses")
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setCourses(data);
      })
      .catch();
  }, []);
  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setCategories(data);
      });
  });
  return (
    <>
      <AppContext.Provider
        value={{ user, setUser, isLogin, setIsLogin, courses, categories }}
      >
        <Routes>
          <Route path="/" element={<HomeUser></HomeUser>} />
          <Route path="/admin" element={<HomeAdmin></HomeAdmin>} />
          <Route path="/login" element={<Login></Login>} />
          <Route path="/register" element={<Register></Register>} />
          <Route path="/instructors" element={<Instructor></Instructor>} />
          <Route
            path="/course/detail"
            element={<GetDetailCourse></GetDetailCourse>}
          />
          <Route
            path="/courses/category"
            element={<GetCoursesWithCategory_Id />}
          />
          <Route path="/admin/category" element={<QuanLyDanhMuc />} />
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export default App;
