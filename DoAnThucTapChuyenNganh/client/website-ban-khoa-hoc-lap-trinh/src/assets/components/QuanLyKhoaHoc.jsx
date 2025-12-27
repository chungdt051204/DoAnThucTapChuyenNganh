import { Link, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "./AppContext";
import { toast } from "react-toastify";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import AdminNavBar from "./AdminNavBar";
import PriceFilter from "./PriceFilter";
import CategoryFilter from "./CategoryFilter";
import Footer from "./Footer";
import "./components-css/QuanLyKhoaHoc.css";

export default function QuanLyKhoaHoc() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { courses, setCourses, categories, refresh, setRefresh } =
    useContext(AppContext);
  const id = searchParams.get("id");
  const search = searchParams.get("search");
  const category_id = searchParams.get("category_id");
  const priceRange = searchParams.get("price");
  const addDialog = useRef();
  const updateDialog = useRef();
  const [courseWithId, setCourseWithId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [priceSelected, setPriceSelected] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const addImage = useRef();
  const updateImage = useRef();
  const addThumbnail = useRef();
  const updateThumbnail = useRef();
  const [errTitle, setErrTitle] = useState("");
  const [errCategory, setErrCategory] = useState("");
  const [errPrice, setErrPrice] = useState("");
  const [errFile, setErrImage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append("search", encodeURIComponent(search));
    if (category_id) params.append("category_id", category_id);
    if (priceRange) params.append("price", priceRange);
    fetchAPI({
      url: `${url}/course?${params.toString()}`,
      setData: setCourses,
    });
    setSearchValue("");
  }, [refresh, setCourses, category_id, search, priceRange]);
  //Hàm xử lý chức năng tìm kiếm khóa học
  const handleClickSearch = () => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (searchValue) nextParams.set("search", searchValue);
      else nextParams.delete("search");
      return nextParams;
    });
  };
  //Hàm xử lý chọn danh mục
  const handleCategoryChange = (value) => {
    setCategorySelected(value);
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (value) nextParams.set("category_id", value);
      else nextParams.delete("category_id");
      return nextParams;
    });
  };
  //Hàm xử lý chọn giá
  const handlePriceChange = (value) => {
    setPriceSelected(value);
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (value) nextParams.set("price", value);
      else nextParams.delete("price");
      return nextParams;
    });
  };
  //Hàm xử lý chức năng thêm khóa học
  const handleAddSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi submit form mặc định của trình duyệt
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
    } else if (!addImage.current.files[0] || !addThumbnail.current.files[0]) {
      // Kiểm tra file (Image) có tồn tại không
      setErrImage("Bạn chưa chọn file");
      return;
    }
    // Chuẩn bị và Gửi Request
    const formData = new FormData(); // Tạo đối tượng FormData để gửi dữ liệu form và file
    formData.append("title", title); // Thêm dữ liệu tiêu đề
    formData.append("categoryId", categorySelected); // Thêm ID danh mục
    formData.append("price", price); // Thêm giá
    formData.append("image", addImage.current.files[0]); // Thêm file hình ảnh
    formData.append("thumbnail", addThumbnail.current.files[0]);

    // Gửi yêu cầu POST đến API để thêm khóa học
    fetch("http://localhost:3000/course", {
      method: "POST",
      body: formData, // Đính kèm FormData
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu HTTP status, parse JSON
        throw res; // Nếu status lỗi,  ném Response object để xử lý lỗi
      })
      .then(({ message }) => {
        toast.success(message); // Hiển thị thông báo thành công từ server
        setRefresh((prev) => prev + 1); // Kích hoạt tải lại dữ liệu
        addDialog.current.close(); // Đóng modal/dialog Thêm mới
      })
      .catch(async (err) => {
        const { message } = await err.json(); // Đọc body lỗi để lấy thông báo chi tiết
        console.log(message); // Hiển thị thông báo lỗi chi tiết
      });
  };
  //Hàm xử lý chức năng sửa khóa học
  const handleClickUpdate = (id) => {
    fetchAPI({ url: `${url}/course?id=${id}`, setData: setCourseWithId });
    updateDialog.current.showModal();
  };
  const handleUpdateSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn submit form mặc định
    // Chuẩn bị và Gửi Request
    const formData = new FormData(); // Tạo FormData
    // Thêm dữ liệu State vô formData
    formData.append("title", title);
    formData.append("categoryId", categorySelected);
    formData.append("price", price);
    // Thêm file hình ảnh mới
    formData.append("image", updateImage.current.files[0]);
    formData.append("thumbnail", updateThumbnail.current.files[0]);
    // Gửi yêu cầu PUT đến API, đính kèm ID khóa học vào query string
    fetch(`http://localhost:3000/course?id=${id}`, {
      method: "PUT",
      body: formData, // Đính kèm FormData
    })
      .then((res) => {
        if (res.ok) return res.json(); // Nếu HTTP status , parse JSON
        throw res; // Nếu status lỗi, ném Response object
      })
      .then(({ message }) => {
        // Xử lý Thành công
        toast.success(message); // Hiển thị thông báo thành công
        setRefresh((prev) => prev + 1); // Kích hoạt tải lại dữ liệu
        updateDialog.current.close(); // Đóng modal Cập nhật
      })
      .catch(async (err) => {
        //Xử lý Lỗi
        const { message } = await err.json(); // Lấy thông báo lỗi chi tiết từ body
        console.log(message); // Hiển thị thông báo lỗi chi tiết
      });
  };
  //Hàm xử lý chức năng xóa khóa học
  const handleDelete = (id) => {
    //Gửi yêu cầu DELETE đến API, đính kèm ID khóa học vào query string
    fetch(`http://localhost:3000/course?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        //Kiểm tra Response: Nếu thành công , parse JSON
        if (res.ok) return res.json();
        // Nếu lỗi, ném Response object để xử lý lỗi
        throw res;
      })
      .then(({ message }) => {
        // Xử lý thành công: Hiển thị thông báo
        toast.success(message);
        // Cập nhật dữ liệu để component hiển thị danh sách mới
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        // Xử lý lỗi: Lấy thông báo lỗi chi tiết từ body của Response object đã ném
        const { message } = await err.json();
        toast.error(message); // Hiển thị thông báo lỗi
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
          <div className="search-wrapper">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClickSearch();
              }}
              className="course-search-input"
              placeholder="Tìm khóa học"
            />
            <button
              type="button"
              className="search-btn"
              onClick={handleClickSearch}
              aria-label="Tìm"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <CategoryFilter
            selectedValue={categorySelected}
            onCategoryChange={handleCategoryChange}
          />
          <PriceFilter
            selectedValue={priceSelected}
            onPriceChange={handlePriceChange}
          />
        </div>
        <h3 style={{ marginLeft: "30px" }}>Tổng khóa học: {courses.length}</h3>
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
                        {value.price > 0 ? `${value.price} VNĐ` : "Miễn phí"}
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
        <h2>Thêm khóa học</h2>
        <form action="" method="dialog" onSubmit={handleAddSubmit}>
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
          <select
            className="form-select"
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
          <input
            onChange={(e) => {
              setPrice(e.target.value);
              setErrPrice("");
            }}
            type="text"
            placeholder="Nhập giá"
          />
          {errPrice && <span>{errPrice}</span>}
          Image:
          <div className="avatar-group">
            <input
              type="file"
              name="image"
              ref={addImage}
              className="custom-file-input"
              accept=".jpg, .jpeg, .png"
            />
          </div>
          Thumbnail:
          <div className="avatar-group">
            <input
              type="file"
              name="image"
              ref={addThumbnail}
              className="custom-file-input"
              accept=".jpg, .jpeg, .png"
            />
          </div>
          {errFile && <span>{errFile}</span>}
          <button>Thêm</button>
        </form>
      </dialog>
      <dialog ref={updateDialog}>
        <h2>Sửa khóa học</h2>
        <form action="" method="dialog" onSubmit={handleUpdateSubmit}>
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
              setErrTitle("");
            }}
            defaultValue={courseWithId.title}
          />
          <select
            className="form-select"
            onChange={(e) => {
              setCategorySelected(e.target.value);
              setErrCategory("");
            }}
          >
            <option value={courseWithId ? courseWithId.categoryId._id : ""}>
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
          <input
            onChange={(e) => {
              setPrice(e.target.value);
              setErrPrice("");
            }}
            type="text"
            defaultValue={courseWithId.price}
          />
          Image:
          <div className="avatar-group">
            <input
              type="file"
              name="image"
              ref={updateImage}
              className="custom-file-input"
              accept=".jpg, .jpeg, .png"
            />
          </div>
          Thumbnail:
          <div className="avatar-group">
            <input
              type="file"
              name="image"
              ref={updateThumbnail}
              className="custom-file-input"
              accept=".jpg, .jpeg, .png"
            />
          </div>
          <br />
          <button>Cập nhật</button>
        </form>
      </dialog>
      <Footer />
    </>
  );
}
