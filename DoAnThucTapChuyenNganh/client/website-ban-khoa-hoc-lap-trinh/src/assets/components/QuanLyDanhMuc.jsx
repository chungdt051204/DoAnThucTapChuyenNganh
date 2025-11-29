import { useContext, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppContext from "./AppContext";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import "./components-css/QuanLyDanhMuc.css";

export default function QuanLyDanhMuc() {
  const { categories } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const addDialog = useRef();
  const updateDialog = useRef();
  const addDialogValue = useRef();
  const updateDialogValue = useRef();
  const [err, setErr] = useState("");
  const [categoryWithId, setCategoryWithId] = useState("");
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (addDialogValue.current.value === "") {
      setErr("Vui lòng nhập tên danh mục muốn thêm");
      return;
    }
    fetch("http://localhost:3000/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: addDialogValue.current.value }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
        addDialog.current.close();
      })
      .catch();
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
        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => {
              addDialog.current.showModal();
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
