import { useContext, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppContext from "./AppContext";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import "./components-css/QuanLyDanhMuc.css";

export default function QuanLyDanhMuc() {
  const { categories } = useContext(AppContext); // lấy danh mục từ context: đây là danh sách sẽ hiển thị trong bảng

  const [searchParams] = useSearchParams(); // lấy id từ url
  const id = searchParams.get("id");

  // các dialog và input
  const addDialog = useRef(); // dialog thêm
  const updateDialog = useRef(); // dialog sửa
  const addDialogValue = useRef(); // input thêm
  const updateDialogValue = useRef(); // input sửa
  // dùng để mở/đóng dialog và lấy giá trị của input

  // quản lý lỗi + dữ liệu category cần sửa
  const [err, setErr] = useState("");
  const [categoryWithId, setCategoryWithId] = useState("");

  const handleAddSubmit = (e) => {
    // hàm chạy khi bấm nút "thêm"
    e.preventDefault(); // ngăn reload trang
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
      })
      .catch(); // kết thúc
  };

  const handleClickUpdate = (id) => {
    fetch(`http://localhost:3000/category?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCategoryWithId(data);
        updateDialog.current.showModal();
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/category?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ title: updateDialogValue.current.value }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
        updateDialog.current.close();
      })
      .catch();
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/category?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
      })
      .catch();
  };

  return (
    <>
      <section>
        <AdminNavBar />
        <div style={{ margin: "100px 50px" }}>
          <button
            onClick={() => {
              addDialog.current.showModal(); // mở dialog thêm
            }}
          >
            Thêm danh mục
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
                            onClick={() => handleClickUpdate(value._id)}
                            class="fa-solid fa-pen"
                          ></i>
                        </Link>
                      </td>
                      <td>
                        <i
                          onClick={() => handleDelete(value._id)}
                          class="fa-solid fa-trash"
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
