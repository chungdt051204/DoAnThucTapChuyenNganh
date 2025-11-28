// CategoriesList.jsx
import React, { useEffect, useState } from "react";

const CategoriesList = ({ endpoint = "http://localhost:3000/categories" }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [busyIds, setBusyIds] = useState(new Set());
  const [globalMsg, setGlobalMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Error fetching categories");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchCategories();

    const onUpdated = () => fetchCategories();
    const onEdit = (e) => {
      // e.detail.id contains id to edit
      const id = e?.detail?.id;
      if (!id) return;
      // find category and open edit
      const cat = categories.find((c) => (c._id || c.id) === id) || {};
      setEditingId(id);
      setTempTitle(cat.title || cat.name || "");
      // focus handled below by effect (optional)
    };

    window.addEventListener("categoriesUpdated", onUpdated);
    window.addEventListener("editCategory", onEdit);

    return () => {
      mounted = false;
      window.removeEventListener("categoriesUpdated", onUpdated);
      window.removeEventListener("editCategory", onEdit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    endpoint /*NOTE: categories used inside onEdit — but we intentionally don't include to avoid refetch loop*/,
  ]);

  // helper to manage busy set
  const setBusy = (id, val) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (val) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const saveEdit = async (id) => {
    const title = (tempTitle || "").trim();
    if (!title) {
      setGlobalMsg("Tên danh mục không được rỗng.");
      setTimeout(() => setGlobalMsg(null), 2500);
      return;
    }
    try {
      setBusy(id, true);
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Lỗi server: ${res.status} ${res.statusText} ${text}`);
      }
      setGlobalMsg("Cập nhật thành công.");
      setEditingId(null);
      setTempTitle("");
      window.dispatchEvent(new Event("categoriesUpdated"));
    } catch (err) {
      setGlobalMsg(err.message || "Lỗi khi cập nhật.");
    } finally {
      setBusy(id, false);
      setTimeout(() => setGlobalMsg(null), 3000);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempTitle("");
  };

  if (loading) return <div>Đang tải danh mục...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      {categories.length === 0 ? (
        <div>Không có danh mục.</div>
      ) : (
        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {categories.map((cat) => {
            const id = cat._id || cat.id;
            const isEditing = editingId === id;
            const busy = busyIds.has(id);
            return (
              <li
                key={id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div style={{ flex: 1 }}>
                  {isEditing ? (
                    <input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      disabled={busy}
                      aria-label={`Tên danh mục ${id}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    <span>{cat.title || cat.name || JSON.stringify(cat)}</span>
                  )}
                </div>

                {/* Gợi ý hiển thị trạng thái nhỏ (không phải nút) */}
                {isEditing ? (
                  <>
                    <button onClick={() => saveEdit(id)} disabled={busy}>
                      {busy ? "Đang lưu..." : "Lưu"}
                    </button>
                    <button onClick={cancelEdit} disabled={busy}>
                      Hủy
                    </button>
                  </>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      {globalMsg && <div style={{ marginTop: 8 }}>{globalMsg}</div>}
    </div>
  );
};

export default CategoriesList;
