import { useContext, useState } from "react";
import AppContext from "./AppContext";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/UserProfile.css";

export default function UserProfile() {
  const { user } = useContext(AppContext);
  const avatar = user.avatar.includes("https")
    ? user.avatar
    : `http://localhost:3000/images/user/${user.avatar}`;
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <UserNavBar />
      <div className="profile-container">
        <h2 className="profile-title">Thông tin người dùng</h2>
        <div className="profile-avatar-wrapper">
          <img className="profile-avatar" src={avatar} alt="Avatar" />
        </div>
        <div className="profile-field">
          <label>Username:</label>
          <input type="text" defaultValue={user.username} />
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <input type="email" defaultValue={user.email} />
        </div>
        <div className="profile-field">
          <label>Password:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              defaultValue={user.password}
              readOnly
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>
        <button className="profile-button">Cập nhật thông tin</button>
      </div>
      <Footer />
    </>
  );
}
