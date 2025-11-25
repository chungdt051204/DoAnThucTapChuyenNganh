import { Routes, Route } from "react-router-dom";
import AppContext from "./assets/components/AppContext";
import Home from "./assets/components/Home";
import Login from "./assets/components/Login";
import Register from "./assets/components/Register";
import { useEffect, useState } from "react";
import Instructor from "./assets/components/Instructors";
import GetDetailCourse from "./assets/components/Detail";

function App() {
  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [courses, setCourses] = useState([]);
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
  return (
    <>
      <AppContext.Provider value={{ user, isLogin, setIsLogin, courses }}>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/login" element={<Login></Login>} />
          <Route path="/register" element={<Register></Register>} />
          <Route path="/instructors" element={<Instructor></Instructor>} />
          <Route
            path="/course/detail"
            element={<GetDetailCourse></GetDetailCourse>}
          />
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export default App;
