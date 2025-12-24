import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import { toast } from "react-toastify";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import "./components-css/QuanLyNguoiDung.css";

export default function QuanLyNguoiDung() {
  const [searchParams, setSearchParams] = useSearchParams(); //Xử dụng useSearchParams để cập nhật queryString và lấy dữ liệu queryString
  const role = searchParams.get("role");
  const { users, setUsers, refresh, setRefresh } = useContext(AppContext);
  const [roleSelected, setRoleSelected] = useState(""); // State lưu trữ giá trị vai trò đang được chọn.

  useEffect(() => {
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    fetchAPI({ url: `${url}/user?${params.toString()}`, setData: setUsers });
  }, [refresh, setUsers, role]);
  //Xử lý chọn vai trò
  const handleRoleSelected = (value) => {
    setRoleSelected(value);
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (value) nextParams.set("role", value);
      else nextParams.delete("role");
      return nextParams;
    });
  };
  //Xử lý cập nhật trạng thái người dùng
  const handleSetStatusUser = (user) => {
    //Xác định trạng thái mới: Đảo ngược trạng thái hiện tại (active <-> banned)
    const status = user.status === "active" ? "banned" : "active";
    //Gửi yêu cầu PUT để cập nhật trạng thái người dùng
    fetch(`http://localhost:3000/user/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", //Báo hiệu dữ liệu gửi đi là JSON
      },
      body: JSON.stringify({ status: status }), //Gửi trạng thái mới trong body
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu thành công, parse JSON
        throw res; // Nếu lỗi, ném Response object
      })
      .then(({ message }) => {
        //Xử lý Thành công
        console.log(message); // Log thông báo thành công
        setRefresh((prev) => prev + 1); // Kích hoạt tải lại dữ liệu danh sách
      })
      .catch(async (err) => {
        //Xử lý Lỗi
        const { message } = await err.json(); //Lấy thông báo lỗi chi tiết từ body response
        console.log(message); // Hiển thị thông báo lỗi
      });
  };
  //Xử lý xóa người dùng
  const handleDelete = (id) => {
    //Gửi yêu cầu DELETE đến API, sử dụng ID người dùng trong URL path
    fetch(`http://localhost:3000/user/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        // Kiểm tra Response: Nếu thành công (status 2xx), parse JSON
        if (res.ok) return res.json();
        // Nếu lỗi (status 4xx, 5xx), ném Response object để xử lý lỗi
        throw res;
      })
      .then(({ message }) => {
        //  Xử lý thành công: Hiển thị thông báo
        toast.success(message);
        // Kích hoạt tải lại dữ liệu danh sách người dùng
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        //Xử lý Lỗi: Lấy thông báo lỗi chi tiết từ body của Response object
        const { message } = await err.json();
        toast.error(message); // Hiển thị thông báo lỗi
      });
  };
  return (
    <>
      <AdminNavBar />
      <section className="user-management" style={{ margin: "50px" }}>
        <select
          value={roleSelected}
          onChange={(e) => handleRoleSelected(e.target.value)}
          className="role-select"
          style={{ marginBottom: "20px" }}
        >
          <option value="">Chọn vai trò</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th className="table-header">Username</th>
                <th className="table-header">Email</th>
                <th className="table-header">Vai trò</th>
                <th className="table-header">Trạng thái</th>
                <th className="table-header action-column">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 &&
                users.map((value, index) => {
                  return (
                    <tr key={index} className="table-row">
                      <td>{value.username}</td>
                      <td>{value.email}</td>
                      <td>{value.role}</td>
                      <td>
                        {/* Dùng style inline cho trạng thái */}
                        <p
                          style={{
                            color: value.status === "banned" ? "red" : "green",
                          }}
                        >
                          {value.status}
                        </p>
                      </td>
                      <td className="action-column">
                        {value.role === "admin" ? (
                          ""
                        ) : (
                          <button
                            onClick={() => handleSetStatusUser(value)}
                            className={`action-btn ${
                              value.status === "banned"
                                ? "action-reactivate"
                                : "action-deactivate"
                            }`}
                          >
                            {value.status === "banned"
                              ? "Hủy vô hiệu hóa"
                              : "Vô hiệu hóa"}
                          </button>
                        )}
                        {value.role === "admin" ? (
                          ""
                        ) : (
                          <button
                            onClick={() => handleDelete(value._id)}
                            className="action-btn action-delete"
                          >
                            Xóa
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
      <Footer />
    </>
  );
}
