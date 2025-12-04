import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import { useEffect, useRef, useState } from "react";
import "./components-css/QuanLyNguoiDung.css";
export default function QuanLyNguoiDung() {
  const [refresh, setRefresh] = useState(0);
  const [users, setUsers] = useState([]);
  const [usersWithRole, setUsersWithRole] = useState([]);
  const roleSelectedRef = useRef();
  const [roleSelected, setRoleSelected] = useState("");
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
    if (user.role === "admin") {
      alert("Không thể thay đổi trạng thái của quản trị viên");
      return;
    } else {
      const status = user.status === "active" ? "banned" : "active";
      fetch(`http://localhost:3000/admin/user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then(({ message }) => {
          console.log(message);
          setRefresh((prev) => prev + 1);
        })
        .catch();
    }
  };
  return (
    <>
      <AdminNavBar />
      <section className="user-management">
        <select
          onChange={handleRoleSelected}
          ref={roleSelectedRef}
          className="role-select"
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
                            <button className="action-btn action-delete">
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
                          <button className="action-btn action-delete">
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
