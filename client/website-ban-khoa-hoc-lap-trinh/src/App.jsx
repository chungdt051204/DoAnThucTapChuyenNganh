import { Routes, Route, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import AppContext from "./assets/components/AppContext";
import { fetchAPI } from "./assets/service/api";
import Login from "./assets/pages/Login";
import Register from "./assets/pages/Register";
import HomeUser from "./assets/pages/HomeUser";
import UserProfile from "./assets/pages/UserProfile";
import Cart from "./assets/pages/Cart";
import MyCourses from "./assets/pages/MyCourses";
import MyOrder from "./assets/pages/MyOrder";
import OrderDetail from "./assets/pages/OrderDetail";
import CoursesWithQueryString from "./assets/components/CoursesWithQueryString";
import DetailCourse from "./assets/pages/DetailCourse";
import HomeAdmin from "./assets/pages/HomeAdmin";
import QuanLyDanhMuc from "./assets/pages/QuanLyDanhMuc";
import QuanLyKhoaHoc from "./assets/pages/QuanLyKhoaHoc";
import QuanLyNguoiDung from "./assets/pages/QuanLyNguoiDung";
import QuanLyDonHang from "./assets/pages/QuanLyDonHang";
import UserNavBar from "./assets/components/UserNavBar";
import AdminNavBar from "./assets/components/AdminNavBar";

export const url = "http://localhost:3000";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    // Xử lý token nếu có trên URL (thường dùng cho Login Google)
    if (token) {
      localStorage.setItem("token", token);
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("token");
        return newParams;
      });
    }

    // Lấy thông tin user hiện tại
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      fetch(`${url}/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then(({ result }) => {
          setIsLogin(true);
          setUser(result);
        })
        .catch(() => {
          setIsLogin(false);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [refresh, token, setSearchParams]);

  useEffect(() => {
    fetchAPI({ url: `${url}/category?_limit=10`, setData: setCategories });
    fetchAPI({ url: `${url}/course`, setData: setCourses });
    fetchAPI({ url: `${url}/user`, setData: setUsers });
    fetchAPI({ url: `${url}/order`, setData: setOrders });
  }, [refresh]);

  return (
    <>
      <AppContext.Provider
        value={{
          isLoading,
          user,
          setUser,
          isLogin,
          setIsLogin,
          categories,
          setCategories,
          courses,
          setCourses,
          users,
          setUsers,
          orders,
          setOrders,
          refresh,
          setRefresh,
        }}
      >
        <Routes>
          <Route path="/" element={<HomeUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/course" element={<DetailCourse />} />
          <Route
            path="/courses/category"
            element={<CoursesWithQueryString text="Khóa học theo danh mục" />}
          />
          <Route
            path="/courses/search"
            element={
              <CoursesWithQueryString text="Khóa học theo từ khóa tìm kiếm" />
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/my-orders" element={<MyOrder />} />
          <Route
            path="/my-orders/detail"
            element={<OrderDetail component={<UserNavBar />} />}
          />
          <Route path="/admin" element={<HomeAdmin />} />
          <Route path="/admin/category" element={<QuanLyDanhMuc />} />
          <Route path="/admin/course" element={<QuanLyKhoaHoc />} />
          <Route path="/admin/user" element={<QuanLyNguoiDung />} />
          <Route path="/admin/order" element={<QuanLyDonHang />} />
          <Route
            path="/admin/order/detail"
            element={<OrderDetail component={<AdminNavBar />} />}
          />
        </Routes>
        <ToastContainer position="top-center" autoClose={1000} />
      </AppContext.Provider>
    </>
  );
}

export default App;
