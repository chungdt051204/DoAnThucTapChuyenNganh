import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "./AppContext";
import "./components-css/Auth.css";
import { useRef, useState } from "react";
export default function Login() {
  const { setIsLogin } = useContext(AppContext);
  const navigate = useNavigate();
  const [loginNotValid, setLoginNotValid] = useState("");
  const email = useRef();
  const password = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.current.value === "" || password.current.value === "") {
      setLoginNotValid("Vui lòng điền đầy đủ thông tin");
      return;
    } else {
      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.current.value,
          password: password.current.value,
        }),
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then(({ message }) => {
          alert(message);
          navigate("/");
          setIsLogin(true);
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
              type="email"
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
        <p>
          Chưa có tài khoản? <Link to="/Register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
