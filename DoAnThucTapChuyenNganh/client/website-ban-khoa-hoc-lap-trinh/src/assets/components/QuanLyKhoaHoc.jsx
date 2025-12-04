import { useContext, useRef, useState } from "react";
import AppContext from "./AppContext";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import "./components-css/QuanLyKhoaHoc.css";

/**
 * Helper function: Định dạng URL ảnh khóa học
 * - Nếu không có ảnh: trả về string rỗng
 * - Nếu ảnh là URL đầy đủ: trả về nguyên URL
 * - Nếu ảnh chỉ là tên file: thêm đường dẫn server vào
 */
const getImageUrl = (image) => {
  // Nếu không có ảnh, trả về chuỗi rỗng
  if (!image) return "";
  // Nếu image là URL đầy đủ (ví dụ: Cloudinary), trả về nguyên URL
  if (image.includes("http")) return image;
  // Nếu image chỉ là tên file trên server, mã hóa tên file để tránh lỗi URL
  // (ví dụ: khoảng trắng hoặc ký tự đặc biệt trong tên file)
  return `http://localhost:3000/images/course/${encodeURIComponent(image)}`;
};

export default function QuanLyKhoaHoc() {
  // Lấy dữ liệu từ context: danh sách khóa học, danh mục, hàm refresh dữ liệu
  const { courses, categories, setRefresh } = useContext(AppContext);

  // Refs để điều khiển dialog và input file
  const addDialog = useRef(); // Dialog thêm khóa học
  const updateDialog = useRef(); // Dialog cập nhật khóa học
  const imageRef = useRef(); // Input file ảnh (dùng cho cả add và update)
  const categoryFilterRef = useRef(); // Select filter danh mục

  // State cho form thêm khóa học
  const [addFormData, setAddFormData] = useState({
    title: "",
    categoryId: "0",
    price: "",
  });

  // State cho form cập nhật khóa học
  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    categoryId: "0",
    price: "",
  });

  // State cho lỗi validation
  const [errTitle, setErrTitle] = useState("");
  const [errCategory, setErrCategory] = useState("");
  const [errPrice, setErrPrice] = useState("");
  const [errImage, setErrImage] = useState("");

  // State cho lọc theo danh mục
  const [categoryId, setCategoryId] = useState("");
  const [coursesWithCategory_Id, setCoursesWithCategory_Id] = useState([]);

  // State lưu khóa học đang được cập nhật
  const [courseWithId, setCourseWithId] = useState("");

  const handleCategorySelected = () => {
    // Lấy giá trị danh mục từ select
    if (categoryFilterRef.current.value != 0) {
      // Lưu danh mục đang chọn
      setCategoryId(categoryFilterRef.current.value);

      // Gọi API lấy khóa học theo danh mục
      fetch(
        `http://localhost:3000/courses/category?category_id=${categoryFilterRef.current.value}`
      )
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then((data) => {
          // Lưu danh sách khóa học lọc theo danh mục
          setCoursesWithCategory_Id(data);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      // Nếu chọn "Lọc danh mục" (không chọn danh mục nào), hiển thị tất cả
      setCategoryId("");
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();

    // Xóa tất cả lỗi cũ
    setErrTitle("");
    setErrCategory("");
    setErrPrice("");
    setErrImage("");

    // Validation: Kiểm tra tên khóa học
    if (addFormData.title.trim() === "") {
      setErrTitle("Vui lòng nhập tên khóa học");
      return;
    }

    // Validation: Kiểm tra danh mục
    if (addFormData.categoryId === "0") {
      setErrCategory("Bạn chưa chọn danh mục");
      return;
    }

    // Validation: Kiểm tra giá
    if (addFormData.price.trim() === "") {
      setErrPrice("Vui lòng nhập giá");
      return;
    }

    // Validation: Kiểm tra ảnh
    if (!imageRef.current.files[0]) {
      setErrImage("Bạn chưa chọn ảnh");
      return;
    }

    // Tạo FormData để gửi file và dữ liệu form
    const formData = new FormData();
    formData.append("title", addFormData.title);
    formData.append("categoryId", addFormData.categoryId);
    formData.append("price", addFormData.price);
    formData.append("image", imageRef.current.files[0]); // Backend sẽ dùng cho cả image và thumbnail

    // Gửi POST request đến server
    fetch("http://localhost:3000/admin/course", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        // Thêm thành công
        alert(message);

        // Refresh danh sách khóa học
        setRefresh((prev) => prev + 1);

        // Đóng dialog
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
  // Lấy thông tin khóa học từ server và mở dialog cập nhật
  const handleClickUpdate = (courseId) => {
    // Gọi API lấy thông tin chi tiết khóa học
    fetch(`http://localhost:3000/course?id=${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        // Lưu khóa học đang cập nhật
        setCourseWithId(data);

        // Điền dữ liệu vào form cập nhật
        setUpdateFormData({
          title: data.title,
          categoryId: data.categoryId._id,
          price: data.price,
        });

        // Reset file input và lỗi
        imageRef.current.value = "";
        setErrTitle("");
        setErrCategory("");
        setErrPrice("");
        setErrImage("");

        // Mở dialog cập nhật
        updateDialog.current.showModal();
      });
  };

  // Xử lý submit form cập nhật khóa học
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    // Xóa tất cả lỗi cũ
    setErrTitle("");
    setErrCategory("");
    setErrPrice("");
    setErrImage("");

    // Validation: Kiểm tra tên khóa học
    if (updateFormData.title.trim() === "") {
      setErrTitle("Vui lòng nhập tên khóa học");
      return;
    }

    // Validation: Kiểm tra giá (chuyển số thành string trước khi trim)
    if (
      !updateFormData.price ||
      updateFormData.price.toString().trim() === ""
    ) {
      setErrPrice("Vui lòng nhập giá");
      return;
    }

    // Tạo FormData để gửi dữ liệu cập nhật
    const formData = new FormData();
    formData.append("title", updateFormData.title);
    formData.append(
      "categoryId",
      updateFormData.categoryId || courseWithId.categoryId._id
    );
    formData.append("price", updateFormData.price);

    // Chỉ append file ảnh nếu người dùng chọn file mới
    // Backend sẽ tự động cập nhật cả image và thumbnail từ file này
    if (imageRef.current.files[0]) {
      formData.append("image", imageRef.current.files[0]);
    }

    // Gửi PUT request để cập nhật khóa học
    fetch(`http://localhost:3000/admin/course?id=${courseWithId._id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        // Xử lý lỗi từ server
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Cập nhật khóa học thất bại");
          });
        }
        return res.json();
      })
      .then(({ message }) => {
        // Cập nhật thành công
        alert(message);

        // Refresh danh sách khóa học
        setRefresh((prev) => prev + 1);

        // Đóng dialog
        updateDialog.current.close();

        // Reset form sau khi cập nhật thành công
        setUpdateFormData({ title: "", categoryId: "0", price: "" });
        imageRef.current.value = "";
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert("Lỗi: " + (err.message || "Cập nhật khóa học thất bại"));
      });
  };
  // Xóa khóa học
  const handleDelete = (id) => {
    // Gửi DELETE request đến server
    fetch(`http://localhost:3000/admin/course?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        // Xóa thành công
        alert(message);

        // Refresh danh sách khóa học
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
                            src={getImageUrl(value.image)}
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
                          <i
                            onClick={() => handleClickUpdate(value._id)}
                            className="fa-solid fa-pen"
                            style={{ cursor: "pointer" }}
                          ></i>
                          <i
                            onClick={() => handleDelete(value._id)}
                            className="fa-solid fa-trash"
                            style={{ cursor: "pointer" }}
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
                            src={getImageUrl(value.image)}
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
                          <i
                            onClick={() => handleClickUpdate(value._id)}
                            className="fa-solid fa-pen"
                            style={{ cursor: "pointer" }}
                          ></i>
                          <i
                            onClick={() => handleDelete(value._id)}
                            className="fa-solid fa-trash"
                            style={{ cursor: "pointer" }}
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
          <h3>Cập nhật khóa học</h3>

          {/* Course Title Input */}
          <div>
            <label>Tên khóa học:</label>
            <input
              type="text"
              value={updateFormData.title}
              onChange={(e) =>
                setUpdateFormData({ ...updateFormData, title: e.target.value })
              }
              placeholder="Nhập tên khóa học"
            />
            {errTitle && <span className="error-message">{errTitle}</span>}
          </div>

          {/* Category Dropdown */}
          <div>
            <label>Danh mục:</label>
            <select
              value={updateFormData.categoryId}
              onChange={(e) =>
                setUpdateFormData({
                  ...updateFormData,
                  categoryId: e.target.value,
                })
              }
            >
              <option value={updateFormData.categoryId}>
                {courseWithId?.categoryId?.title || "Chọn danh mục"}
              </option>
              {categories.length > 0 &&
                categories.map((value, index) => (
                  <option key={index} value={value._id}>
                    {value.title}
                  </option>
                ))}
            </select>
            {errCategory && (
              <span className="error-message">{errCategory}</span>
            )}
          </div>

          {/* Price Input */}
          <div>
            <label>Giá:</label>
            <input
              type="text"
              value={updateFormData.price}
              onChange={(e) =>
                setUpdateFormData({ ...updateFormData, price: e.target.value })
              }
              placeholder="Nhập giá"
            />
            {errPrice && <span className="error-message">{errPrice}</span>}
          </div>

          {/* Image File Input */}
          <div>
            <label>Ảnh khóa học:</label>
            <input
              type="file"
              accept="image/*"
              ref={imageRef}
              onChange={() => setErrImage("")}
            />
            {errImage && <span className="error-message">{errImage}</span>}
          </div>

          {/* Action Buttons */}
          <div className="dialog-actions">
            <button type="submit">Cập nhật</button>
            <button
              type="button"
              onClick={() => {
                updateDialog.current.close();
                setErrTitle("");
                setErrCategory("");
                setErrPrice("");
                setErrImage("");
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      </dialog>

      <Footer />
    </>
  );
}
