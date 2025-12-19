import { useContext, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppContext from "./AppContext";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import "./components-css/QuanLyDanhMuc.css";
import { fetchAPI } from "../service/api";
import { url } from "../../App";

export default function QuanLyDanhMuc() {
  const { categories, setRefresh } = useContext(AppContext); // lấy danh mục từ useContext
  const [searchParams] = useSearchParams(); // lấy id từ query String
  const id = searchParams.get("id");
  // các dialog và input
  const addDialog = useRef(); // dialog thêm
  const updateDialog = useRef(); // dialog sửa
  const addDialogValue = useRef(); // input thêm
  const updateDialogValue = useRef(); // input sửa
  // quản lý lỗi + dữ liệu category cần sửa
  const [err, setErr] = useState("");
  const [categoryWithId, setCategoryWithId] = useState("");
  const handleAddSubmit = (e) => {
    // hàm chạy khi bấm nút "thêm"
    e.preventDefault(); // ngăn sự kiện submit mặc định
    if (addDialogValue.current.value === "") {
      setErr("Vui lòng nhập tên danh mục muốn thêm");
      return;
    }
    // Gửi dữ liệu lên backend bằng post
    fetch("http://localhost:3000/category", {
      // gọi API đến backend
      method: "POST",
      headers: {
        "Content-Type": "application/json", // báo cáo cho backend biết dữ liệu bạn gửi là JSON
      },
      body: JSON.stringify({ title: addDialogValue.current.value }), // gửi tên danh mục bạn vừa nhập
    })
      //kiểm tra phản hồi từ server
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      // xử lý dữ liệu từ backend
      .then(({ message }) => {
        alert(message);
        addDialog.current.close(); // đóng dialog
        setRefresh((prev) => prev + 1); //Tăng giá trị state 'refresh' để kích hoạt tải lại dữ liệu
      })
      .catch(async (err) => {
        const { message } = await err.json(); // Lấy thông báo lỗi chi tiết từ body response
        console.log(message);
      });
  };
  const handleClickUpdate = (id) => {
    fetchAPI({ url: `${url}/category?id=${id}`, setData: setCategoryWithId });
    updateDialog.current.showModal();
  };
  const handleUpdateSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi gửi form mặc định của trình duyệt.
    //  Gọi API Cập nhật
    // Gửi yêu cầu PUT đến API, kèm theo ID của danh mục cần cập nhật dưới dạng query parameter.
    fetch(`http://localhost:3000/category?id=${id}`, {
      method: "PUT", // Phương thức HTTP chuẩn để cập nhật/thay thế tài nguyên.
      headers: {
        "Content-type": "application/json", // Chỉ định dữ liệu gửi đi là JSON.
      },
      // Đóng gói dữ liệu mới thành chuỗi JSON để gửi đi.
      body: JSON.stringify({ title: updateDialogValue.current.value }),
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu thành công (2xx), parse JSON.
        throw res; // Nếu thất bại, ném response.
      })
      .then(({ message }) => {
        alert(message); // Hiển thị thông báo thành công từ server.
        updateDialog.current.close(); // Đóng hộp thoại/modal cập nhật.
        setRefresh((prev) => prev + 1); // Tăng state 'refresh' để kích hoạt tải lại dữ liệu danh mục.
      })
      .catch(async (err) => {
        const { message } = await err.json(); // Lấy thông báo lỗi chi tiết từ body response
        alert(message);
      });
  };
  const handleDelete = (id) => {
    // Gửi yêu cầu DELETE đến API, kèm theo ID của danh mục cần xóa dưới dạng query parameter
    fetch(`http://localhost:3000/category?id=${id}`, {
      method: "DELETE", // Phương thức HTTP chuẩn để xóa tài nguyên
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu thành công (2xx), parse JSON
        throw res; // Nếu thất bại, ném response để xử lý lỗi
      })
      .then(({ message }) => {
        alert(message); // Hiển thị thông báo thành công từ server
        setRefresh((prev) => prev + 1); // Tăng giá trị state 'refresh' để kích hoạt tải lại dữ liệu
      })
      .catch(async (err) => {
        const { message } = await err.json(); // Lấy thông báo lỗi chi tiết từ body response
        alert(message);
      });
  };
  return (
    <>
      <section>
        <AdminNavBar />
        <div style={{ margin: "100px 50px" }}>
          <button
            className="btn-add-category"
            onClick={() => {
              addDialog.current.showModal();
            }}
          >
            + Thêm danh mục
          </button>
          <table className="category-table" border={1}>
            <thead>
              <tr>
                <th>Danh mục</th>
                <th colSpan={2}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 &&
                categories.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{value.title}</td>
                      <td>
                        <Link to={`/admin/category?id=${value._id}`}>
                          <i
                            style={{ color: "blue" }}
                            onClick={() => handleClickUpdate(value._id)}
                            className="fa-solid fa-pen"
                          ></i>
                        </Link>
                      </td>
                      <td>
                        <i
                          style={{ color: "red" }}
                          onClick={() => handleDelete(value._id)}
                          className="fa-solid fa-trash"
                        ></i>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <Footer />
        {/* Giao diện các bảng dialog */}
        <dialog ref={addDialog}>
          <h2>Thêm danh mục</h2>
          <form method="dialog" onSubmit={handleAddSubmit}>
            <input
              type="text"
              ref={addDialogValue}
              placeholder="Nhập tên danh mục muốn thêm"
            />
            {err && <p>{err}</p>}
            <button>Thêm</button>
          </form>
        </dialog>
        <dialog ref={updateDialog}>
          <h2>Sửa danh mục</h2>
          <form method="dialog" onSubmit={handleUpdateSubmit}>
            <input
              type="text"
              ref={updateDialogValue}
              defaultValue={categoryWithId !== "" ? categoryWithId.title : ""}
            />
            {err && <p>{err}</p>}
            <button>Sửa</button>
          </form>
        </dialog>
      </section>
    </>
  );
}
