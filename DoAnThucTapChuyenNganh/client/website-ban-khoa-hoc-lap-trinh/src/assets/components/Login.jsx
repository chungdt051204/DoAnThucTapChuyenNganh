import { Link } from "react-router-dom";
import "./components-css/Auth.css";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="auth-page">
      <div className="formAuth">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder=" "
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" "
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button>Login</button>
        </form>
        <p>
          Chưa có tài khoản? <Link to="/Register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
