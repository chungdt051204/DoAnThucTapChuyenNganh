import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import AdminNavBar from "../components/AdminNavBar";
import PriceFilter from "../components/PriceFilter";
import CategoryFilter from "../components/CategoryFilter";
import Footer from "../components/Footer";
import "../styles/QuanLyKhoaHoc.css";
import PaginationButton from "../components/PaginationButton";

export default function QuanLyKhoaHoc() {
  const navigate = useNavigate();
  const { isLoading, isLogin, user, categories, refresh, setRefresh } =
    useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const page = searchParams.get("page");
  const id = searchParams.get("id");
  const search = searchParams.get("search");
  const category_id = searchParams.get("category_id");
  const priceRange = searchParams.get("price");
  const [courses, setCourses] = useState([]);
  const [courseWithId, setCourseWithId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [categorySelected, setCategorySelected] = useState(null);
  const [priceSelected, setPriceSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [errCategory, setErrCategory] = useState("");
  const [errFile, setErrFile] = useState("");
  const formDialog = useRef();
  const confirmDialog = useRef();
  const image = useRef();
  const thumbnail = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (!isLoading) {
      if (!isLogin || user.role !== "admin") {
        navigate("/");
        return;
      }
    }
  }, [isLogin, isLoading, navigate, user]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page) params.append("_page", page);
    if (search) params.append("search", search);
    if (category_id) params.append("category_id", category_id);
    if (priceRange) params.append("price", priceRange);
    fetchAPI({
      url: `${url}/course?${params.toString()}&_limit=10`,
      setData: setCourses,
    });
    setSearchValue("");
  }, [refresh, page, setCourses, category_id, search, priceRange]);

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
  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (categorySelected == 0) {
      setErrCategory("Vui lòng chọn danh mục");
      return;
    }
    if (!image.current.files[0] || !thumbnail.current.files[0]) {
      setErrFile("Bạn chưa chọn file");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryId", categorySelected);
    formData.append("price", price);
    formData.append("image", image.current.files[0]);
    formData.append("thumbnail", thumbnail.current.files[0]);
    fetch(`${url}/course`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setRefresh((prev) => prev + 1);
        formDialog.current.close();
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };
  //Hàm xử lý chức năng sửa khóa học
  const handleOpenDialog = (id) => {
    setIsEdit(true);
    params.set("id", id);
    formDialog.current.showModal();
    navigate(`?${params.toString()}`);
  };
  const handleUpdateCourse = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryId", categorySelected);
    formData.append("price", price);
    formData.append("image", image.current.files[0]);
    formData.append("thumbnail", thumbnail.current.files[0]);
    fetch(`${url}/course?id=${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setRefresh((prev) => prev + 1);
        formDialog.current.close();
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };
  //Hàm xử lý chức năng xóa khóa học
  const handleDelete = () => {
    fetch(`${url}/course?id=${courseWithId?._id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        toast.error(message);
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
              formDialog.current.showModal();
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
        <h3 style={{ marginLeft: "30px" }}>
          Tổng khóa học: {courses?.docs?.length}
        </h3>
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
              {courses?.docs?.map((value, index) => {
                const isSelected = index === 0 ? "selected" : "";
                return (
                  <tr key={index} className={isSelected}>
                    <td className="course-title-cell">
                      <img
                        src={value.image}
                        alt=""
                        className="course-img"
                        width={50}
                        height={50}
                      />
                      <span className="course-name">{value.title}</span>
                    </td>
                    <td style={{ fontWeight: "500" }}>
                      {value.categoryId.title}
                    </td>
                    <td className="price-cell">
                      {value.price > 0 ? `${value.price}` : "Miễn phí"}
                    </td>
                    <td className="action-cell">
                      <Link to={`/admin/course?id=${value._id}`}>
                        <i
                          onClick={() => handleOpenDialog(value._id)}
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
          <PaginationButton totalPages={courses?.totalPages} />
        </div>
      </div>
      <dialog ref={formDialog}>
        <h2>{isEdit ? "Sửa thông tin khóa học" : "Thêm khóa học"}</h2>
        <form
          method="dialog"
          onSubmit={isEdit ? handleUpdateCourse : handleCreateCourse}
        >
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Nhập tên khóa học"
            required
          />
          <br />
          <select
            className="form-select"
            onChange={(e) => {
              setCategorySelected(e.target.value);
              setErrCategory("");
            }}
          >
            <option value="0">Chọn danh mục</option>
            {categories?.docs?.map((value, index) => {
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
            }}
            type="text"
            placeholder="Nhập giá"
            required
          />
          Image:
          <div className="avatar-group">
            <input
              type="file"
              name="image"
              ref={image}
              className="custom-file-input"
              accept=".jpg, .jpeg, .png"
            />
          </div>
          Thumbnail:
          <div className="avatar-group">
            <input
              type="file"
              name="image"
              ref={thumbnail}
              className="custom-file-input"
              accept=".jpg, .jpeg, .png"
            />
          </div>
          {errFile && <span>{errFile}</span>}
          <button>Lưu</button>
          <button
            onClick={() => {
              setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                if (newParams.has("id")) newParams.delete("id");
                return newParams;
              });
              formDialog.current.close();
            }}
            type="button"
          >
            Hủy
          </button>
        </form>
      </dialog>
      <Footer />
    </>
  );
}
