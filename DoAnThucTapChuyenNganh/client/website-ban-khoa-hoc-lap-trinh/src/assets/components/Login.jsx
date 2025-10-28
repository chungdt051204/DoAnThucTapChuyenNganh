import { Link } from "react-router-dom";
import "./components-css/Auth.css";
export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <section>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
          />
          <button>Login</button>
        </form>
        <p>
          Chưa có tài khoản? <a href="/Register">Đăng ký ngay</a>
        </p>
      </section>
    </>
  );
}
