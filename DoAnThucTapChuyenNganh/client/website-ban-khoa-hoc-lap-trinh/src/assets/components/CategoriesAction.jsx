// CategoriesAction.jsx
import React, { useEffect, useState } from "react";

/**
 * Chỉ hiển thị 2 nút: Sửa (phát event 'editCategory') và Xóa (DELETE)
 * Props:
 *  - endpoint: base API (mặc định http://localhost:3000/categories)
 */
const CategoriesAction = ({
  endpoint = "http://localhost:3000/categories",
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState(null);
  const [busyIds, setBusyIds] = useState(new Set());
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      setLoadingList(true);
      setErrorList(null);
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setErrorList(err.message || "Lỗi khi tải danh mục");
      } finally {
        if (!mounted) return;
        setLoadingList(false);
      }
    };

    fetchCategories();
    const onUpdated = () => fetchCategories();
    window.addEventListener("categoriesUpdated", onUpdated);
    return () => {
      mounted = false;
      window.removeEventListener("categoriesUpdated", onUpdated);
    };
  }, [endpoint]);

  const setBusy = (id, val) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (val) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleEdit = (id) => {
    // phát sự kiện để CategoriesList bật chế độ edit cho id này
    window.dispatchEvent(new CustomEvent("editCategory", { detail: { id } }));
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Xác nhận xóa danh mục "${title}" ?`)) return;
    try {
      setBusy(id, true);
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Lỗi server: ${res.status} ${res.statusText} ${text}`);
      }
      setMsg("Xóa thành công.");
      window.dispatchEvent(new Event("categoriesUpdated"));
    } catch (err) {
      setMsg(err.message || "Lỗi khi xóa.");
    } finally {
      setBusy(id, false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  if (loadingList) return <div>Đang tải hành động...</div>;
  if (errorList) return <div>Lỗi: {errorList}</div>;
  if (categories.length === 0) return <div>Không có hành động.</div>;

  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {categories.map((cat) => {
          const id = cat._id || cat.id;
          const busy = busyIds.has(id);
          return (
            <li
              key={id}
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {/* Không hiển thị label ở đây — chỉ hiển thị 2 nút */}
              <button
                onClick={() => handleEdit(id)}
                disabled={busy}
                title="Sửa"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(id, cat.title || cat.name || "")}
                disabled={busy}
                title="Xóa"
              >
                {busy ? "Đang..." : "Xóa"}
              </button>
            </li>
          );
        })}
      </ul>

      {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
    </div>
  );
};

export default CategoriesAction;
