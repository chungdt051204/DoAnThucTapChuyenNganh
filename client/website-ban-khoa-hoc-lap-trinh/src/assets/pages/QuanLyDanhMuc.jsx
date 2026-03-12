import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useRef, useState, useEffect } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
import { fetchAPI } from "../service/api";
import { url } from "../../App";
import AdminNavBar from "../components/AdminNavBar";
import Footer from "../components/Footer";
import PaginationButton from "../components/PaginationButton";
import "../styles/QuanLyDanhMuc.css";

export default function QuanLyDanhMuc() {
  const navigate = useNavigate();
  const {
    isLoading,
    isLogin,
    refresh,
    setRefresh,
    user,
    categories,
    setCategories,
  } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = searchParams.get("id");
  const page = searchParams.get("page");
  const [categoryName, setCategoryName] = useState("");
  const [categoryWithId, setCategoryWithId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const formDialog = useRef();

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
    fetchAPI({
      url: `${url}/category?${params.toString()}&_limit=2`,
      setData: setCategories,
    });
  }, [refresh, page, setCategories]);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchAPI({ url: `${url}/category?id=${id}`, setData: setCategoryWithId });
    } else {
      setIsEdit(false);
      setCategoryName("");
    }
  }, [id]);

  useEffect(() => {
    if (categoryWithId !== null) {
      setCategoryName(categoryWithId?.title);
      formDialog.current.showModal();
    }
  }, [categoryWithId]);

  //Hàm xử lý chức năng thêm danh mục
  const handleCreateCategory = (e) => {
    e.preventDefault();
    fetch(`${url}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: categoryName }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        formDialog.current.close();
        setCategoryName("");
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };

  //Hàm xử lý bấm vào icon cây bút hiện popup dialog chứa thông tin danh mục được chọn
  const handleOpenDialog = (id) => {
    setIsEdit(true);
    params.set("id", id);
    formDialog.current.showModal();
    navigate(`?${params.toString()}`);
  };

  //Hàm xử lý chức năng sửa danh mục
  const handleUpdateCategory = (e) => {
    e.preventDefault();
    fetch(`${url}/category?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ title: categoryName }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        formDialog.current.close();
        setCategoryName("");
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (newParams.has("id")) newParams.delete("id");
          return newParams;
        });
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };

  //Hàm xử lý chức năng xóa danh mục
  const handleDelete = (id) => {
    fetch(`${url}/category?id=${id}`, {
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
      <section>
        <AdminNavBar />
        <div style={{ margin: "50px" }}>
          <button
            className="btn-add-category"
            onClick={() => {
              formDialog.current.showModal();
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
              {categories?.docs?.map((value) => {
                return (
                  <tr key={value._id}>
                    <td>{value.title}</td>
                    <td>
                      <Link to={`/admin/category?id=${value._id}`}>
                        <i
                          style={{ color: "blue" }}
                          onClick={() => handleOpenDialog(value._id)}
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
          <PaginationButton totalPages={categories?.totalPages} />
        </div>
        <dialog ref={formDialog}>
          <h2>{isEdit ? "Sửa thông tin danh mục" : "Thêm danh mục"}</h2>
          <form
            method="dialog"
            onSubmit={isEdit ? handleUpdateCategory : handleCreateCategory}
          >
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              type="text"
              placeholder="Nhập tên danh mục muốn thêm"
              required
            />
            <button>Lưu</button>
            <button
              type="button"
              onClick={() => {
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  if (newParams.has("id")) newParams.delete("id");
                  return newParams;
                });
                formDialog.current.close();
              }}
            >
              Hủy
            </button>
          </form>
        </dialog>
        <Footer />
      </section>
    </>
  );
}
