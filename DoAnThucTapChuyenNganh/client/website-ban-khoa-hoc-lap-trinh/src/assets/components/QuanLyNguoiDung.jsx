import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import { useEffect, useRef, useState } from "react";
import "./components-css/QuanLyNguoiDung.css";
export default function QuanLyNguoiDung() {
  const [refresh, setRefresh] = useState(0); // State dùng để kích hoạt tải lại dữ liệu khi giá trị thay đổi.
  const [users, setUsers] = useState([]); // State lưu trữ danh sách tất cả người dùng (users).
  const [usersWithRole, setUsersWithRole] = useState([]); // State lưu trữ danh sách người dùng đã được lọc theo vai trò
  const [roleSelected, setRoleSelected] = useState(""); // State lưu trữ giá trị vai trò đang được chọn/lọc.
  const roleSelectedRef = useRef(); // Tham chiếu đến phần tử DOM để lấy giá trị vai trò được chọn
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setUsers(data);
      })
      .catch();
  }, [refresh]);
  const handleRoleSelected = () => {
    if (roleSelectedRef.current.value != "") {
      setRoleSelected(roleSelectedRef.current.value);
      fetch(
        `http://localhost:3000/users/role?role=${roleSelectedRef.current.value}`
      )
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then((data) => {
          console.log(data);
          setUsersWithRole(data);
          setRefresh((prev) => prev + 1);
        })
        .catch();
    } else {
      setRoleSelected("");
    }
  };
  const handleSetStatusUser = (user) => {
    //Xác định trạng thái mới: Đảo ngược trạng thái hiện tại (active <-> banned)
    const status = user.status === "active" ? "banned" : "active";
    //Gửi yêu cầu PUT để cập nhật trạng thái người dùng
    fetch(`http://localhost:3000/admin/user/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", //Báo hiệu dữ liệu gửi đi là JSON
      },
      body: JSON.stringify({ status: status }), //Gửi trạng thái mới trong body
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu status 2xx, parse JSON
        throw res; // Nếu lỗi (4xx, 5xx), ném Response object
      })
      .then(({ message }) => {
        //Xử lý Thành công
        console.log(message); // Log thông báo thành công
        setRefresh((prev) => prev + 1); // Kích hoạt tải lại dữ liệu danh sách
      })
      .catch(async (err) => {
        // 4. Xử lý Lỗi
        const { message } = await err.json(); //Lấy thông báo lỗi chi tiết từ body response
        console.log(message); // Hiển thị thông báo lỗi
      });
  };
  const handleDelete = (id) => {
    //Gửi yêu cầu DELETE đến API, sử dụng ID người dùng trong URL path
    fetch(`http://localhost:3000/admin/user/${id}`, {
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
        alert(message);
        // Kích hoạt tải lại dữ liệu danh sách người dùng
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        //Xử lý Lỗi: Lấy thông báo lỗi chi tiết từ body của Response object
        const { message } = await err.json();
        alert(message); // Hiển thị thông báo lỗi
      });
  };
  return (
    <>
      <AdminNavBar />
      <section className="user-management" style={{ margin: "50px" }}>
        <select
          onChange={handleRoleSelected}
          ref={roleSelectedRef}
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
              {!roleSelected && users.length > 0
                ? users.map((value, index) => {
                    return (
                      <tr key={index} className="table-row">
                        <td>{value.username}</td>
                        <td>{value.email}</td>
                        <td>{value.role}</td>
                        <td>
                          {/* Dùng style inline cho trạng thái */}
                          <p
                            style={{
                              color:
                                value.status === "banned" ? "red" : "green",
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
                  })
                : usersWithRole.length > 0 &&
                  usersWithRole.map((value, index) => {
                    return (
                      <tr key={index} className="table-row">
                        <td>{value.username}</td>
                        <td>{value.email}</td>
                        <td>{value.role}</td>
                        <td>
                          {/* Dùng style inline cho trạng thái */}
                          <p
                            style={{
                              color:
                                value.status === "banned" ? "red" : "green",
                            }}
                          >
                            {value.status}
                          </p>
                        </td>
                        <td className="action-column">
                          <button
                            onClick={() => handleSetStatusUser(value)}
                            // Giữ lại class cho nút Hành động
                            className={`action-btn ${
                              value.status == "banned"
                                ? "action-reactivate"
                                : "action-deactivate"
                            }`}
                          >
                            {value.status == "banned"
                              ? "Hủy vô hiệu hóa"
                              : "Vô hiệu hóa"}
                          </button>
                          <button
                            onClick={() => handleDelete(value._id)}
                            className="action-btn action-delete"
                          >
                            Xóa
                          </button>
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
