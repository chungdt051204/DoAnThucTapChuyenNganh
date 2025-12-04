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
  const imageRef = useRef();
  const thumbnailRef = useRef();
  const categoryFilterRef = useRef();

  // Add form state
  const [addFormData, setAddFormData] = useState({
    title: "",
    categoryId: "0",
    price: "",
  });

  // Update form state
  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    categoryId: "0",
    price: "",
  });

  const [errTitle, setErrTitle] = useState("");
  const [errCategory, setErrCategory] = useState("");
  const [errPrice, setErrPrice] = useState("");
  const [errImage, setErrImage] = useState("");
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
    setErrTitle("");
    setErrCategory("");
    setErrPrice("");
    setErrImage("");
    if (addFormData.title.trim() === "") {
      setErrTitle("Vui lòng nhập tên khóa học");
      return;
    }
    if (addFormData.categoryId === "0") {
      setErrCategory("Bạn chưa chọn danh mục");
      return;
    }
    if (addFormData.price.trim() === "") {
      setErrPrice("Vui lòng nhập giá");
      return;
    }
    if (!imageRef.current.files[0]) {
      setErrImage("Bạn chưa chọn ảnh");
      return;
    }
    const formData = new FormData();
    formData.append("title", addFormData.title);
    formData.append("categoryId", addFormData.categoryId);
    formData.append("price", addFormData.price);
    formData.append("image", imageRef.current.files[0]);
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
        // Reset form
        setAddFormData({ title: "", categoryId: "0", price: "" });
        imageRef.current.value = "";
        setErrTitle("");
        setErrCategory("");
        setErrPrice("");
        setErrImage("");
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi: " + (err.message || "Thêm khóa học thất bại"));
      });
  };
  const handleClickUpdate = (courseId) => {
    fetch(`http://localhost:3000/course?id=${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setCourseWithId(data);
        setUpdateFormData({
          title: data.title,
          categoryId: data.categoryId._id,
          price: data.price,
        });
        updateDialog.current.showModal();
      });
  };
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (updateFormData.title.trim() === "") {
      setErrTitle("Vui lòng nhập tên khóa học");
      return;
    } else if (updateFormData.price.trim() === "") {
      setErrPrice("Vui lòng nhập giá");
      return;
    } else if (!imageRef.current.files[0] || !thumbnailRef.current.files[0]) {
      setErrImage("Bạn chưa chọn file");
      return;
    }
    const formData = new FormData();
    formData.append("title", updateFormData.title);
    formData.append(
      "categoryId",
      updateFormData.categoryId || courseWithId.categoryId._id
    );
    formData.append("price", updateFormData.price);
    formData.append("image", imageRef.current.files[0]);
    formData.append("thumbnail", thumbnailRef.current.files[0]);
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
      .catch((err) => {
        console.error(err);
        alert("Lỗi: " + (err.message || "Cập nhật khóa học thất bại"));
      });
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
        <div className="course-controls">
          <button
            className="add-course-btn"
            onClick={() => {
              addDialog.current.showModal();
            }}
          >
            Thêm khóa học
          </button>
          <input
            type="text"
            className="course-search-input"
            name=""
            id=""
            placeholder="Tìm khóa học"
          />
          <select
            className="category-filter-select"
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
                <th className="course-col">Khóa học</th>
                <th>Danh mục</th>
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
        <form onSubmit={handleAddSubmit}>
          Tên khóa học:
          <input
            type="text"
            value={addFormData.title}
            onChange={(e) => {
              setAddFormData({ ...addFormData, title: e.target.value });
              setErrTitle("");
            }}
            placeholder="Nhập tên khóa học"
          />
          {errTitle && <span className="error-message">{errTitle}</span>}
          <br />
          Danh mục:
          <select
            value={addFormData.categoryId}
            onChange={(e) => {
              setAddFormData({ ...addFormData, categoryId: e.target.value });
              setErrCategory("");
            }}
          >
            <option value="0">Chọn danh mục</option>
            {categories.length > 0 &&
              categories.map((value, index) => (
                <option key={index} value={value._id}>
                  {value.title}
                </option>
              ))}
          </select>
          {errCategory && <span className="error-message">{errCategory}</span>}
          <br />
          Giá:
          <input
            type="text"
            value={addFormData.price}
            onChange={(e) => {
              setAddFormData({ ...addFormData, price: e.target.value });
              setErrPrice("");
            }}
            placeholder="Nhập giá"
          />
          {errPrice && <span className="error-message">{errPrice}</span>}
          <br />
          Ảnh khóa học:
          <input
            type="file"
            onChange={() => {
              setErrImage("");
            }}
            ref={imageRef}
          />
          {errImage && <span className="error-message">{errImage}</span>}
          <br />
          <button type="submit">Thêm</button>
          <button
            type="button"
            onClick={() => {
              addDialog.current.close();
              setAddFormData({ title: "", categoryId: "0", price: "" });
              imageRef.current.value = "";
              setErrTitle("");
              setErrCategory("");
              setErrPrice("");
              setErrImage("");
            }}
          >
            Hủy
          </button>
        </form>
      </dialog>

      <dialog ref={updateDialog}>
        <form onSubmit={handleUpdateSubmit}>
          Tên khóa học:
          <input
            type="text"
            value={updateFormData.title}
            onChange={(e) => {
              setUpdateFormData({ ...updateFormData, title: e.target.value });
              setErrTitle("");
            }}
          />
          {errTitle && <span>{errTitle}</span>}
          <br />
          Danh mục:
          <select
            value={updateFormData.categoryId}
            onChange={(e) => {
              setUpdateFormData({
                ...updateFormData,
                categoryId: e.target.value,
              });
              setErrCategory("");
            }}
          >
            <option value={updateFormData.categoryId}>
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
            type="text"
            value={updateFormData.price}
            onChange={(e) => {
              setUpdateFormData({ ...updateFormData, price: e.target.value });
              setErrPrice("");
            }}
          />
          {errPrice && <span>{errPrice}</span>}
          <br />
          Thumbnail:
          <input
            type="file"
            ref={thumbnailRef}
            onChange={() => {
              setErrImage("");
            }}
          />
          <br />
          {errImage && <span>{errImage}</span>}
          <br />
          <button type="submit">Cập nhật</button>
          <button type="button" onClick={() => updateDialog.current.close()}>
            Hủy
          </button>
        </form>
      </dialog>

      <Footer />
    </>
  );
}
