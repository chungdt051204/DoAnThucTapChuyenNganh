import { useContext, useState, useRef } from "react";
import AppContext from "./AppContext";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/UserProfile.css";

export default function UserProfile() {
  const { user, setUser } = useContext(AppContext);
  const [showDialog, setShowDialog] = useState(false);
  const [preview, setPreview] = useState("");
  const [nameValue, setNameValue] = useState(user?.fullName || "");
  const [passwordValue, setPasswordValue] = useState(user?.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordInDialog, setShowPasswordInDialog] = useState(false);
  const fileRef = useRef();

  const avatarSrc =
    user && user.avatar && user.avatar.includes("https")
      ? user.avatar
      : user && user.avatar
      ? `http://localhost:3000/images/user/${user.avatar}`
      : "";

  function openDialog() {
    setNameValue(user?.fullName || "");
    setPasswordValue(user?.password || "");
    setPreview("");
    setShowDialog(true);
  }

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return setPreview("");
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    if (fileRef.current && fileRef.current.files[0]) {
      formData.append("avatar", fileRef.current.files[0]);
    }
    formData.append("fullName", nameValue || "");
    formData.append("password", passwordValue || "");

    try {
      const res = await fetch("http://localhost:3000/me", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.user) setUser(data.user);
        else setUser((prev) => ({ ...prev, fullName: nameValue }));
        setShowDialog(false);
        alert("Cập nhật thành công");
        return;
      }

      // If backend not available or returns non-OK, fallback to local update
      setUser((prev) => ({ ...prev, fullName: nameValue }));
      setShowDialog(false);
      alert("Cập nhật cục bộ (backend không phản hồi)");
    } catch (err) {
      console.error(err);
      // fallback to local update
      setUser((prev) => ({ ...prev, fullName: nameValue }));
      setShowDialog(false);
      alert(
        "Cập nhật cục bộ (lỗi kết nối).\nKiểm tra server để đồng bộ hóa sau."
      );
    }
  }

  return (
    <>
      <UserNavBar />

      <div className="profile-container">
        <h2 className="profile-title">Thông tin học viên</h2>

        <div className="profile-avatar-wrapper">
          {avatarSrc && (
            <img className="profile-avatar" src={avatarSrc} alt="Avatar" />
          )}
        </div>

        <div className="profile-field">
          <label>Username:</label>
          <input type="text" value={user?.fullName || ""} readOnly />
        </div>

        <div className="profile-field">
          <label>Email:</label>
          <input type="email" value={user?.email || ""} readOnly />
        </div>

        <div className="profile-field">
          <label>Password:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={user?.password || ""}
              readOnly
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <button className="profile-button" onClick={openDialog}>
          Cập nhật thông tin
        </button>
      </div>

      <Footer />

      {showDialog && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h3>Cập nhật thông tin</h3>
            <form onSubmit={handleSubmit}>
              <div className="dialog-row">
                <label>Hình đại diện</label>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    onChange={handleFileChange}
                  />
                  {preview ? (
                    <img src={preview} alt="preview" className="preview" />
                  ) : avatarSrc ? (
                    <img src={avatarSrc} alt="current" className="preview" />
                  ) : null}
                </div>
              </div>

              <div className="dialog-row">
                <label>Tên</label>
                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                />
              </div>

              <div className="dialog-row">
                <label>Mật khẩu</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type={showPasswordInDialog ? "text" : "password"}
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInDialog((s) => !s)}
                    style={{ marginLeft: 8 }}
                  >
                    {showPasswordInDialog ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className="dialog-actions">
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setShowDialog(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
