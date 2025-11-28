import React, { useEffect, useState } from "react";

// Simple list component: fetches categories and displays them with delete buttons
export default function CategoriesListSimple() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/categories");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    const onUpdated = () => fetchCategories();
    window.addEventListener("categoriesUpdated", onUpdated);
    return () => window.removeEventListener("categoriesUpdated", onUpdated);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa danh mục này?")) return;
    try {
      const res = await fetch(`http://localhost:3000/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // notify other components to refresh
      window.dispatchEvent(new Event("categoriesUpdated"));
    } catch (err) {
      alert("Xóa thất bại: " + (err.message || "error"));
    }
  };

  if (loading) return <div>Đang tải danh mục...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      {categories.length === 0 ? (
        <div>Không có danh mục.</div>
      ) : (
        <ul>
          {categories.map((c) => (
            <li key={c._id || c.id}>
              {c.title}
              <button
                style={{ marginLeft: 8 }}
                onClick={() => handleDelete(c._id || c.id)}
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
