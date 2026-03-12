import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useContext } from "react";
import AppContext from "../components/AppContext";
import { url } from "../../App";
import { toast } from "react-toastify";
import LoginGoogle from "../components/LoginGoogle";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { setIsLogin, setUser } = useContext(AppContext);
  const [loginNotValid, setLoginNotValid] = useState("");
  const email = useRef();
  const password = useRef();

  // Hàm xử lý đăng nhập
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.current.value === "" || password.current.value === "") {
      setLoginNotValid("Vui lòng điền đầy đủ thông tin");
      return;
    } else {
      fetch(`${url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: email.current.value,
          password: password.current.value,
        }),
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then(({ message, token, result }) => {
          setUser(result);
          if (result.status === "banned") {
            setLoginNotValid("Tài khoản này đã bị vô hiệu hóa");
            return;
          } else {
            localStorage.setItem("token", token);
            toast.success(message);
            setIsLogin(true);
            setTimeout(() => {
              navigate(result.role === "admin" ? "/admin" : "/");
            }, 1000);
          }
        })
        .catch(async (err) => {
          if (err.status === 401) {
            const { message } = await err.json();
            setLoginNotValid(message);
          }
        });
    }
  };

  return (
    <div className="auth-page">
      <div className="formAuth">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="email"
              ref={email}
              placeholder=" "
              onChange={() => setLoginNotValid("")}
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              ref={password}
              placeholder=" "
              onChange={() => setLoginNotValid("")}
            />
            <label htmlFor="password">Password</label>
          </div>
          {loginNotValid && <span>{loginNotValid}</span>}
          <button>Login</button>
        </form>
        <LoginGoogle />
        <p>
          Chưa có tài khoản? <Link to="/Register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
