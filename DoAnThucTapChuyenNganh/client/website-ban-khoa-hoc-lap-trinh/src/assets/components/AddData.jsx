// AddData.jsx
import React, { useState } from "react";

/**
 * AddData
 * Props:
 *  - endpoint (string) : URL API để POST dữ liệu (mặc định http://localhost:3000/categories)
 *  - onSuccess (fn)    : callback (optional) nhận object trả về khi thêm thành công
 */
const AddData = ({
  endpoint = "http://localhost:3000/categories",
  onSuccess,
}) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = (value || "").trim();
    if (!title) {
      setError("Vui lòng nhập tên danh mục.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }), // điều chỉnh key nếu backend mong khác (vd: name)
      });

      // Nếu server trả về lỗi, thử đọc body để biết nguyên nhân
      if (!res.ok) {
        let bodyText = "";
        try {
          // cố gắng parse JSON hoặc text
          bodyText = await res.text();
        } catch {}
        throw new Error(
          `Lỗi server: ${res.status} ${res.statusText} ${bodyText}`
        );
      }

      const data = await res.json().catch(() => null);

      setSuccess(
        `Thêm thành công${
          data && (data.title || data.name)
            ? `: ${data.title || data.name}`
            : ""
        }`
      );
      setValue("");

      // báo cho các component khác (ví dụ CategoriesList) refresh dữ liệu
      window.dispatchEvent(new Event("categoriesUpdated"));

      if (typeof onSuccess === "function") onSuccess(data);
    } catch (err) {
      setError(err.message || "Lỗi khi thêm dữ liệu.");
    } finally {
      setLoading(false);
      // ẩn thông báo success sau 3s
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      <input
        type="text"
        placeholder="Thêm danh mục..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
        aria-label="Tên danh mục"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Đang thêm..." : "Thêm danh mục mới"}
      </button>

      {/* Hiển thị lỗi / success */}
      <div aria-live="polite" style={{ marginLeft: 12 }}>
        {error && <span style={{ color: "crimson" }}>{error}</span>}
        {success && <span style={{ color: "green" }}>{success}</span>}
      </div>
    </form>
  );
};

export default AddData;
