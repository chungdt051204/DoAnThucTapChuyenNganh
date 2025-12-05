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
  const [title, setTitle] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [price, setPrice] = useState("");
  const addImage = useRef();
  const updateImage = useRef();
  const categoryFilterRef = useRef();
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
        `http://localhost:3000/courses?category_id=${categoryFilterRef.current.value}`
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
    e.preventDefault(); // Ngăn chặn hành vi submit form mặc định (tải lại trang)
    // Validation (Kiểm tra dữ liệu đầu vào)
    if (title === "") {
      // Kiểm tra trường Tiêu đề
      setErrTitle("Vui lòng nhập tên khóa học");
      return;
    } else if (categorySelected == 0) {
      // Kiểm tra trường Danh mục
      setErrCategory("Bạn chưa chọn danh mục");
      return;
    } else if (price === "") {
      // Kiểm tra trường Giá
      setErrPrice("Vui lòng nhập giá");
      return;
    } else if (!addImage.current.files[0]) {
      // Kiểm tra file (Image) có tồn tại không
      setErrImage("Bạn chưa chọn file");
      return;
    }
    // Chuẩn bị và Gửi Request
    const formData = new FormData(); // Tạo đối tượng FormData để gửi dữ liệu form và file
    formData.append("title", title); // Thêm dữ liệu tiêu đề
    formData.append("categoryId", categorySelected); // Thêm ID danh mục
    formData.append("price", price); // Thêm giá
    formData.append("image", addImage.current.files[0]); // Thêm file hình ảnh (lấy từ Ref)

    // Gửi yêu cầu POST đến API để thêm khóa học
    fetch("http://localhost:3000/admin/course", {
      method: "POST",
      body: formData, // Đính kèm FormData
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu HTTP status 2xx, parse JSON
        throw res; // Nếu status lỗi  ném Response object để xử lý lỗi
      })
      .then(({ message }) => {
        // --- Xử lý Thành công (201 Created) ---
        alert(message); // Hiển thị thông báo thành công từ server
        setRefresh((prev) => prev + 1); // Kích hoạt tải lại dữ liệu (refresh data)
        addDialog.current.close(); // Đóng modal/dialog Thêm mới
      })
      .catch(async (err) => {
        const { message } = await err.json(); // Đọc body lỗi để lấy thông báo chi tiết
        alert(message); // Hiển thị thông báo lỗi chi tiết
      });
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
    e.preventDefault(); // Ngăn chặn submit form mặc định
    // Chuẩn bị và Gửi Request
    const formData = new FormData(); // Tạo FormData
    // Thêm dữ liệu State
    formData.append("title", title);
    formData.append("categoryId", categorySelected);
    formData.append("price", price);
    // Thêm file hình ảnh mới (lấy từ Ref)
    formData.append("image", updateImage.current.files[0]);
    // Gửi yêu cầu PUT (Cập nhật) đến API, đính kèm ID khóa học vào query string
    fetch(`http://localhost:3000/admin/course?id=${id}`, {
      method: "PUT",
      body: formData, // Đính kèm FormData
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu HTTP status 2xx, parse JSON
        throw res; // Nếu status lỗi (4xx, 5xx), ném Response object
      })
      .then(({ message }) => {
        // --- Xử lý Thành công ---
        alert(message); // Hiển thị thông báo thành công
        setRefresh((prev) => prev + 1); // Kích hoạt tải lại dữ liệu
        updateDialog.current.close(); // Đóng modal Cập nhật
      })
      .catch(async (err) => {
        //Xử lý Lỗi
        const { message } = await err.json(); // Lấy thông báo lỗi chi tiết từ body
        alert(message); // Hiển thị thông báo lỗi chi tiết
      });
  };
  const handleDelete = (id) => {
    //Gửi yêu cầu DELETE đến API, đính kèm ID khóa học vào query string
    fetch(`http://localhost:3000/admin/course?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        //Kiểm tra Response: Nếu thành công (status 2xx), parse JSON
        if (res.ok) return res.json();
        // Nếu lỗi (status 4xx, 5xx), ném Response object để xử lý lỗi
        throw res;
      })
      .then(({ message }) => {
        // Xử lý thành công: Hiển thị thông báo
        alert(message);
        // Cập nhật dữ liệu để component hiển thị danh sách mới
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        // Xử lý lỗi: Lấy thông báo lỗi chi tiết từ body của Response object đã ném
        const { message } = await err.json();
        alert(message); // Hiển thị thông báo lỗi
      });
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
            onChange={(e) => {
              setTitle(e.target.value);
              setErrTitle("");
            }}
            placeholder="Nhập tên khóa học"
          />
          {errTitle && <span>{errTitle}</span>}
          <br />
          Danh mục:
          <select
            onChange={(e) => {
              setCategorySelected(e.target.value);
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
            onChange={(e) => {
              setPrice(e.target.value);
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
            ref={addImage}
          />
          <br />
          <button>Thêm</button>
        </form>
      </dialog>
      <dialog ref={updateDialog}>
        <form action="" method="dialog" onSubmit={handleUpdateSubmit}>
          Tên khóa học:
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
              setErrTitle("");
            }}
            defaultValue={courseWithId.title}
          />
          {errTitle && <span>{errTitle}</span>}
          <br />
          Danh mục:
          <select
            onChange={(e) => {
              setCategorySelected(e.target.value);
              setErrCategory("");
            }}
          >
            <option value={courseWithId && courseWithId.categoryId._id}>
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
            onChange={(e) => {
              setPrice(e.target.value);
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
            ref={updateImage}
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
