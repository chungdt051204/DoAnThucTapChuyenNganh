import { useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import AppContext from "../components/AppContext";
import { toast } from "react-toastify";
import { url } from "../../App";
import "../styles/UserProfile.css";
import UserNavBar from "../components/UserNavBar";
import Footer from "../components/Footer";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, setRefresh, isLoading } = useContext(AppContext);
  const [newFullname, setNewFullname] = useState("");
  const passwordRef = useRef();
  const fileRef = useRef();
  const dialog = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  let avatar = null;

  if (user !== null) {
    avatar = user.avatar.includes("https")
      ? user.avatar
      : `${url}/images/user/${user.avatar}`;
  }

  useEffect(() => {
    if (isLoading) return;
    if (!user) navigate("/");
  }, [user, navigate, isLoading]);

  // Hàm xử lý cập nhật thông tin người dùng
  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordRef.current.value === user.password) {
      setErr("Mật khẩu mới không được trùng với mật khẩu cũ");
      return;
    }
    const formData = new FormData();
    formData.append("newFullname", newFullname);
    formData.append("newPassword", passwordRef.current.value);
    formData.append("avatar", fileRef.current.files[0]);
    fetch(`${url}/me/${user._id}`, {
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
        dialog.current.close();
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };

  return (
    <>
      <UserNavBar />
      <div className="profile-container">
        <h2 className="profile-title">Thông tin người dùng</h2>
        <div className="profile-avatar-wrapper">
          <img className="profile-avatar" src={avatar} alt="Avatar" />
        </div>
        <div className="profile-field">
          <label>Fullname:</label>
          <input
            type="text"
            value={user !== null ? user.fullName : ""}
            readOnly
          />
        </div>
        <div className="profile-field">
          <label>Username:</label>
          <input
            type="text"
            value={user !== null ? user.username : ""}
            readOnly
          />
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <input
            type="email"
            value={user !== null ? user.email : ""}
            readOnly
          />
        </div>
        <div className="profile-field">
          <label>Password:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={user !== null ? user.password : ""}
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
        <button
          onClick={() => {
            dialog.current.showModal();
          }}
          className="profile-button"
        >
          Cập nhật thông tin
        </button>
      </div>
      <dialog ref={dialog}>
        <h3>Cập nhật thông tin</h3>
        <form onSubmit={handleSubmit}>
          <div className="dialog-row">
            <label>Hình đại diện</label>
            <div style={{ display: "flex" }}>
              <div className="avatar-group">
                <input
                  type="file"
                  name="avatar"
                  ref={fileRef}
                  className="custom-file-input"
                  accept=".jpg, .jpeg, .png"
                />
              </div>
              <img src={avatar} alt="preview" className="preview" />
            </div>
          </div>
          <div className="dialog-row">
            <label>Fullname:</label>
            <input
              type="text"
              defaultValue={user !== null ? user.fullName : ""}
              onChange={(e) => {
                setNewFullname(e.target.value);
              }}
            />
          </div>
          <div className="dialog-row">
            <label>Mật khẩu mới:</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input type="password" ref={passwordRef} />
            </div>
          </div>
          {err && <span>{err}</span>}
          <div className="dialog-actions">
            <button>Lưu</button>
          </div>
        </form>
      </dialog>
      <Footer />
    </>
  );
}
