import { Link, useSearchParams } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import AppContext from "./AppContext";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import "./components-css/QuanLyKhoaHoc.css";
export default function QuanLyKhoaHoc() {
  const { courses, categories, setRefresh } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const addDialog = useRef();
  const updateDialog = useRef();
  const title = useRef();
  const categoryFilterRef = useRef();
  const categorySelectedRef = useRef();
  const price = useRef();
  const image = useRef();
  const thumbnail = useRef();
  const [errTitle, setErrTitle] = useState("");
  const [errCategory, setErrCategory] = useState("");
  const [errPrice, setErrPrice] = useState("");
  const [errFile, setErrImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coursesWithCategory_Id, setCoursesWithCategory_Id] = useState([]);
  const [courseWithId, setCourseWithId] = useState("");
  const handleCategorySelected = () => {
    if (categoryFilterRef.current.value != 0) {
      setCategoryId(categoryFilterRef.current.value);
      fetch(
        `http://localhost:3000/courses/category?category_id=${categoryFilterRef.current.value}`
      )
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then((data) => {
          setCoursesWithCategory_Id(data);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setCategoryId("");
    }
  };
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (title.current.value === "") {
      setErrTitle("Vui lòng nhập tên khóa học");
      return;
    } else if (categorySelectedRef.current.value == 0) {
      setErrCategory("Bạn chưa chọn danh mục");
      return;
    } else if (price.current.value === "") {
      setErrPrice("Vui lòng nhập giá");
      return;
    } else if (!image.current.files[0] || !thumbnail.current.files[0]) {
      setErrImage("Bạn chưa chọn file");
      return;
    }
    const formData = new FormData();
    formData.append("title", title.current.value);
    formData.append("categoryId", categorySelectedRef.current.value);
    formData.append("price", price.current.value);
    formData.append("image", image.current.files[0]);
    formData.append("thumbnail", thumbnail.current.files[0]);
    fetch("http://localhost:3000/admin/course", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
        setRefresh((prev) => prev + 1);
        addDialog.current.close();
      })
      .catch();
  };
  const handleClickUpdate = (id) => {
    fetch(`http://localhost:3000/course?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourseWithId(data);
        updateDialog.current.showModal();
      });
  };
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (title.current.value === "") {
      setErrTitle("Vui lòng nhập tên khóa học");
      return;
    } else if (price.current.value === "") {
      setErrPrice("Vui lòng nhập giá");
      return;
    } else if (!image.current.files[0] || !thumbnail.current.files[0]) {
      setErrImage("Bạn chưa chọn file");
      return;
    }
    const formData = new FormData();
    formData.append("title", title.current.value);
    formData.append("categoryId", categorySelectedRef.current.value);
    formData.append("price", price.current.value);
    formData.append("image", image.current.files[0]);
    formData.append("thumbnail", thumbnail.current.files[0]);
    fetch(`http://localhost:3000/admin/course?id=${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
        setRefresh((prev) => prev + 1);
        updateDialog.current.close();
      })
      .catch();
  };
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/admin/course?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
        setRefresh((prev) => prev + 1);
      })
      .catch();
  };
  return (
    <>
      <AdminNavBar />
      <div>
        <div class="course-controls">
          <button
            class="add-course-btn"
            onClick={() => {
              addDialog.current.showModal();
            }}
          >
            Thêm khóa học
          </button>
          <input
            type="text"
            class="course-search-input"
            name=""
            id=""
            placeholder="Tìm khóa học"
          />
          <select
            class="category-filter-select"
            ref={categoryFilterRef}
            onChange={handleCategorySelected}
          >
            <option value="">Lọc danh mục</option>
            {categories.length > 0 &&
              categories.map((value, index) => {
                return (
                  <option key={index} value={value._id}>
                    {value.title}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="course-table-container">
          <table>
            <thead>
              <tr>
                <th className="course-col">Khóa học</th> <th>Danh mục</th>
                <th>Giá</th>
                <th className="action-col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {!categoryId && courses.length > 0
                ? courses.map((value, index) => {
                    const isSelected = index === 0 ? "selected" : "";
                    return (
                      <tr key={index} className={isSelected}>
                        <td className="course-title-cell">
                          <img
                            src={value.image}
                            alt=""
                            className="course-image"
                            width={50}
                            height={50}
                          />
                          <span className="course-name">{value.title}</span>
                        </td>
                        <td>{value.categoryId.title}</td>
                        <td className="price-cell">
                          {value.price > 0 ? `${value.price} đ` : "Miễn phí"}
                        </td>
                        <td className="action-cell">
                          <Link to={`/admin/course?id=${value._id}`}>
                            <i
                              onClick={() => handleClickUpdate(value._id)}
                              className="fa-solid fa-pen"
                            ></i>
                          </Link>
                          <i
                            onClick={() => handleDelete(value._id)}
                            className="fa-solid fa-trash"
                          ></i>
                        </td>
                      </tr>
                    );
                  })
                : coursesWithCategory_Id.length > 0 &&
                  coursesWithCategory_Id.map((value, index) => {
                    const isSelected = index === 0 ? "selected" : "";
                    return (
                      <tr key={index} className={isSelected}>
                        <td className="course-title-cell">
                          <img
                            src={value.image}
                            alt=""
                            className="course-image"
                            width={50}
                            height={50}
                          />
                          <span className="course-name">{value.title}</span>
                        </td>
                        <td>{value.categoryId.title}</td>
                        <td className="price-cell">
                          {value.price > 0 ? `${value.price} đ` : "Miễn phí"}
                        </td>
                        <td className="action-cell">
                          <Link to={`/admin/course?id=${value._id}`}>
                            <i
                              onClick={() => handleClickUpdate(value._id)}
                              className="fa-solid fa-pen"
                            ></i>
                          </Link>
                          <i
                            onClick={() => handleDelete(value._id)}
                            className="fa-solid fa-trash"
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          <div className="pagination-controls">
            <button className="btn-prev">Trước</button>
            <button className="btn-next">Sau</button>
          </div>
        </div>
      </div>
      <dialog ref={addDialog}>
        <form action="" method="dialog" onSubmit={handleAddSubmit}>
          Tên khóa học:
          <input
            type="text"
            ref={title}
            onChange={() => {
              setErrTitle("");
            }}
            placeholder="Nhập tên khóa học"
          />
          {errTitle && <span>{errTitle}</span>}
          <br />
          Danh mục:
          <select
            ref={categorySelectedRef}
            onChange={() => {
              setErrCategory("");
            }}
          >
            <option value="0">Chọn danh mục</option>
            {categories.length > 0 &&
              categories.map((value, index) => {
                return (
                  <option key={index} value={value._id}>
                    {value.title}
                  </option>
                );
              })}
          </select>
          <br />
          {errCategory && <span>{errCategory}</span>}
          <br />
          Giá:{" "}
          <input
            ref={price}
            onChange={() => {
              setErrPrice("");
            }}
            type="text"
            placeholder="Nhập giá"
          />
          {errPrice && <span>{errPrice}</span>}
          <br />
          Image:
          <input
            type="file"
            onChange={() => {
              setErrImage("");
            }}
            ref={image}
          />
          Thumbnail:
          <input
            type="file"
            ref={thumbnail}
            onChange={() => {
              setErrImage("");
            }}
          />
          <br />
          {errFile && <span>{errFile}</span>}
          <br />
          <button>Thêm</button>
        </form>
      </dialog>
      <dialog ref={updateDialog}>
        <form action="" method="dialog" onSubmit={handleUpdateSubmit}>
          Tên khóa học:
          <input
            type="text"
            ref={title}
            onChange={() => {
              setErrTitle("");
            }}
            defaultValue={courseWithId.title}
          />
          {errTitle && <span>{errTitle}</span>}
          <br />
          Danh mục:
          <select
            ref={categorySelectedRef}
            onChange={() => {
              setErrCategory("");
            }}
          >
            <option value="0">
              {courseWithId ? courseWithId.categoryId.title : "Chọn danh mục"}
            </option>
            {categories.length > 0 &&
              categories.map((value, index) => {
                return (
                  <option key={index} value={value._id}>
                    {value.title}
                  </option>
                );
              })}
          </select>
          <br />
          {errCategory && <span>{errCategory}</span>}
          <br />
          Giá:
          <input
            ref={price}
            onChange={() => {
              setErrPrice("");
            }}
            type="text"
            defaultValue={courseWithId.price}
          />
          {errPrice && <span>{errPrice}</span>}
          <br />
          Image:
          <input
            type="file"
            onChange={() => {
              setErrImage("");
            }}
            ref={image}
          />
          Thumbnail:
          <input
            type="file"
            ref={thumbnail}
            onChange={() => {
              setErrImage("");
            }}
          />
          <br />
          {errFile && <span>{errFile}</span>}
          <br />
          <button>Cập nhật</button>
        </form>
      </dialog>
      <Footer />
    </>
  );
}
