import { useContext, useState, useRef } from "react";
import AppContext from "./AppContext";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
import "./components-css/UserProfile.css";

export default function UserProfile() {
  // Lấy giá trị 'user'  và 'setRefresh' từ AppContext (Context API của React)
  const { user, setRefresh } = useContext(AppContext);
  // Khai báo state để lưu trữ giá trị tên người dùng mới từ input form
  const [newUsername, setNewUsername] = useState("");
  // Khai báo state để lưu trữ giá trị mật khẩu mới từ input form
  const [newPassword, setNewPassword] = useState("");
  // Khai báo useRef để tham chiếu đến element input nhập mật khẩu
  const passwordRef = useRef();
  // Khai báo state để kiểm soát việc hiển thị hoặc ẩn mật khẩu trên giao diện
  const [showPassword, setShowPassword] = useState(false);
  // Khai báo state để lưu trữ và hiển thị thông báo lỗi cho người dùng
  const [err, setErr] = useState("");
  // Khai báo useRef để tham chiếu đến element input chọn file
  const fileRef = useRef();
  // Khai báo useRef để tham chiếu đến element dialog/modal
  const dialog = useRef();
  // Biến tính toán (derived value) để xác định URL đầy đủ của ảnh đại diện (avatar)
  const avatar =
    // Kiểm tra nếu 'user' tồn tại VÀ URL avatar chứa "https" (là link bên ngoài)
    user && user.avatar.includes("https")
      ? user.avatar // Dùng URL trực tiếp
      : // Nếu không (là tên file được lưu local trên server), tạo URL đầy đủ
        `http://localhost:3000/images/user/${user.avatar}`;
  // Định nghĩa hàm handleSubmit, được gọi khi form được submit
  const handleSubmit = (e) => {
    // Ngăn chặn hành vi mặc định của form
    e.preventDefault();
    // KIỂM TRA TÍNH HỢP LỆ CỦA MẬT KHẨU MỚI
    // So sánh giá trị mật khẩu mới nhập với mật khẩu cũ
    if (passwordRef.current.value === user.password) {
      // Nếu mật khẩu trùng, đặt thông báo lỗi
      setErr("Mật khẩu mới không được trùng với mật khẩu cũ");
      // Dừng hàm
      return;
    }
    // CHUẨN BỊ DỮ LIỆU ĐỂ GỬI LÊN SERVER
    // Tạo đối tượng FormData để chứa dữ liệu form
    const formData = new FormData();
    // Đính kèm tên người dùng mới
    formData.append("newUserName", newUsername);
    // Đính kèm mật khẩu mới
    formData.append("newPassword", newPassword);
    // Đính kèm tệp avatar mới được chọn
    formData.append("avatar", fileRef.current.files[0]);
    // GỬI REQUEST CẬP NHẬT THÔNG TIN LÊN API SERVER
    // Sử dụng Fetch API để gửi yêu cầu PUT đến endpoint cập nhật thông tin người dùng
    fetch(`http://localhost:3000/me/${user._id}`, {
      method: "PUT", // Phương thức HTTP PUT
      body: formData, // Dữ liệu form đã chuẩn bị
    })
      // Xử lý phản hồi (Response) đầu tiên
      .then((res) => {
        // Kiểm tra xem phản hồi có thành công (status 2xx) hay không
        if (res.ok) return res.json(); // Nếu OK, chuyển đổi body sang JSON
        throw res; // Nếu thất bại, ném đối tượng Response để xử lý trong khối catch
      })
      // Xử lý dữ liệu JSON (data) từ phản hồi thành công
      .then(({ message }) => {
        // Hiển thị thông báo thành công cho người dùng
        alert(message);
        // Kích hoạt việc tải lại dữ liệu (ví dụ: cập nhật lại user Context)
        setRefresh((prev) => prev + 1);
        // Đóng dialog/modal cập nhật thông tin
        dialog.current.close();
      })
      // Bắt và xử lý lỗi xảy ra trong quá trình fetch hoặc xử lý response
      .catch(async (err) => {
        // Chờ và chuyển đổi body của Response lỗi thành JSON để lấy thông báo chi tiết
        const { message } = await err.json();
        // Hiển thị thông báo lỗi cho người dùng
        alert(message);
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
            <div>
              <input type="file" ref={fileRef} />
              <img src={avatar} alt="preview" className="preview" />
            </div>
          </div>
          <div className="dialog-row">
            <label>Username:</label>
            <input
              type="text"
              defaultValue={user.username}
              onChange={(e) => {
                setNewUsername(e.target.value);
              }}
            />
          </div>
          <div className="dialog-row">
            <label>Mật khẩu mới:</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="password"
                ref={passwordRef}
                defaultValue={user.password}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
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
