import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "./AppContext";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import "./components-css/QuanLyKhoaHoc.css";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
export default function QuanLyKhoaHoc() {
  const navigate = useNavigate();
  const { courses, setCourses, categories, refresh, setRefresh } =
    useContext(AppContext);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const category_id = searchParams.get("category_id");
  const id = searchParams.get("id");
  const addDialog = useRef();
  const updateDialog = useRef();
  const [searchValue, setSearchValue] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const addImage = useRef();
  const updateImage = useRef();
  const [errTitle, setErrTitle] = useState("");
  const [errCategory, setErrCategory] = useState("");
  const [errPrice, setErrPrice] = useState("");
  const [errFile, setErrImage] = useState("");
  const [courseWithId, setCourseWithId] = useState("");

  useEffect(() => {
    if (search) {
      fetchAPI({
        url: `${url}/course?search=${search}`,
        setData: setCourses,
      });
    } else if (category_id) {
      fetchAPI({
        url: `${url}/course?category_id=${category_id}`,
        setData: setCourses,
      });
    } else {
      fetchAPI({ url: `${url}/course`, setData: setCourses });
    }
  }, [refresh, setCourses, category_id, search]);
  const handleClickSearch = () => {
    if (searchValue) navigate(`/admin/course?search=${searchValue}`);
    else navigate("/admin/course");
  };
  const handleCategorySelected = (value) => {
    setCategorySelected(value);
    if (value) {
      navigate(`/admin/course?category_id=${value}`);
    } else {
      navigate("/admin/course");
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
    fetch("http://localhost:3000/course", {
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
    fetchAPI({ url: `${url}/course?id=${id}`, setData: setCourseWithId });
    updateDialog.current.showModal();
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
    fetch(`http://localhost:3000/course?id=${id}`, {
      method: "PUT",
      body: formData, // Đính kèm FormData
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu HTTP status 2xx, parse JSON
        throw res; // Nếu status lỗi (4xx, 5xx), ném Response object
      })
      .then(({ message }) => {
        // Xử lý Thành công
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
    fetch(`http://localhost:3000/course?id=${id}`, {
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
            onChange={(e) => setSearchValue(e.target.value)}
            className="course-search-input"
            placeholder="Tìm khóa học"
          />
          <button onClick={handleClickSearch}>Tìm</button>
          <select
            className="category-filter-select"
            value={categorySelected}
            onChange={(e) => handleCategorySelected(e.target.value)}
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
                <th className="course-col">Giá</th>
                <th className="action-col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 &&
                courses.map((value, index) => {
                  const image = value.image.includes("https")
                    ? value.image
                    : `http://localhost:3000/images/course/${value.image}`;
                  const isSelected = index === 0 ? "selected" : "";
                  return (
                    <tr key={index} className={isSelected}>
                      <td className="course-title-cell">
                        <img
                          src={image}
                          alt=""
                          className="course-img"
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
