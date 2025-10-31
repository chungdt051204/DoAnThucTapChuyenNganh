import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import "./components-css/Auth.css";
export default function Register() {
  const navigate = useNavigate();
  const [fullNameNotValid, setFullNameNotValid] = useState();
  const [usernameNotValid, setUsernameNotValid] = useState();
  const [emailNotValid, setEmailNotValid] = useState();
  const [passwordNotValid, setPasswordNotValid] = useState();
  const [verifyPasswordNotValid, setVerifyPasswordNotValid] = useState();
  const [phoneNotValid, setPhoneNotValid] = useState();
  const fullName = useRef();
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const verifyPassword = useRef();
  const avatar = useRef();
  const phone = useRef();
  const male = useRef();
  const female = useRef();
  const dateOfBirth = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName.current.value);
    formData.append("username", username.current.value);
    formData.append("email", email.current.value);
    formData.append("password", password.current.value);
    formData.append("avatar", avatar.current.files[0]);
    formData.append("phone", phone.current.value);
    const gender = male.current.checked
      ? male.current.value
      : female.current.value;
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth.current.value);
    // const data = Object.fromEntries(formData.entries());
    // console.log("Dữ liệu form:", data);
    if (fullName.current.value === "") {
      setFullNameNotValid("Họ tên không được bỏ trống");
      return;
    } else if (
      username.current.value === "" ||
      username.current.value.trim().length < 5
    ) {
      setUsernameNotValid("Tên đăng nhập phải có tối thiểu 5 ký tự");
      return;
    } else if (!email.current.value.includes("@")) {
      setEmailNotValid("Vui lòng điền email hợp lệ");
      return;
    } else if (
      password.current.value.length < 8 ||
      password.current.value === username.current.value
    ) {
      setPasswordNotValid(
        "Mật khẩu phải có đủ 8 ký tự và không được trùng với tên đăng nhập"
      );
      return;
    } else if (verifyPassword.current.value !== password.current.value) {
      setVerifyPasswordNotValid("Mật khẩu không khớp");
      return;
    } else if (phone.current.value.length < 10) {
      setPhoneNotValid("Số điện thoại hợp lệ phải có đủ 10 số");
      return;
    } else {
      fetch("http://localhost:3000/register", {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then(({ message }) => {
          alert(message);
          navigate("/login");
        })
        .catch(async (err) => {
          if (err.status === 400) {
            //Lấy dữ liệu gửi từ backend
            const { message } = await err.json();
            setEmailNotValid(message);
          }
        });
    }
  };
  return (
    <>
      <div className="auth-page">
        <div className="formAuth">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="fullname"
                ref={fullName}
                placeholder=" "
                onChange={() => setFullNameNotValid("")}
              />
              <label htmlFor="fullname">Fullname</label>
            </div>
            {fullNameNotValid && <span>{fullNameNotValid}</span>}
            <div className="form-group">
              <input
                type="text"
                name="username"
                ref={username}
                placeholder=" "
                onChange={() => setUsernameNotValid("")}
              />
              <label htmlFor="username">Username</label>
            </div>
            {usernameNotValid && <span>{usernameNotValid}</span>}
            <div className="form-group">
              <input
                type="text"
                name="email"
                ref={email}
                placeholder=" "
                onChange={() => setEmailNotValid("")}
              />
              <label htmlFor="email">Email</label>
            </div>
            {emailNotValid && <span>{emailNotValid}</span>}
            <div className="form-group">
              <input
                type="password"
                name="password"
                ref={password}
                placeholder=" "
                onChange={() => setPasswordNotValid("")}
              />
              <label htmlFor="verifyPassword">Password</label>
            </div>
            {passwordNotValid && <span>{passwordNotValid}</span>}
            <div className="form-group">
              <input
                type="password"
                name="verifyPassword"
                ref={verifyPassword}
                placeholder=" "
                onChange={() => setVerifyPasswordNotValid("")}
              />
              <label htmlFor="password">Verify password</label>
            </div>
            {verifyPasswordNotValid && <span>{verifyPasswordNotValid}</span>}
            <div className="form-group">
              <input
                type="text"
                name="phone"
                ref={phone}
                placeholder=" "
                onChange={() => setPhoneNotValid("")}
              />
              <label htmlFor="phone">Phone</label>
            </div>
            {phoneNotValid && <span>{phoneNotValid}</span>}
            <div className="form-group">
              <input type="date" name="dateOfBirth" ref={dateOfBirth} />
              <label htmlFor="dateOfBirth">Date Of Birth</label>
            </div>
            <div className="gender-group">
              <label htmlFor="gender">Gender: </label>
              <input type="radio" name="gender" ref={male} value="nam" />
              Nam
              <input type="radio" name="gender" ref={female} value="nữ" />
              Nữ
            </div>
            <div className="avatar-group">
              <input type="file" name="avatar" ref={avatar} />
            </div>
            <button>Đăng ký</button>
          </form>
        </div>
      </div>
    </>
  );
}
