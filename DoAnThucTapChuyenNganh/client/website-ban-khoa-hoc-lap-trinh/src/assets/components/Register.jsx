import { useRef } from "react";
import "./components-css/Auth.css";
export default function Register() {
  const fullName = useRef();
  const username = useRef();
  const email = useRef();
  const password = useRef();
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
    const data = Object.fromEntries(formData.entries());
    console.log("Dữ liệu form:", data);
  };
  return (
    <>
      <div className="auth-page">
        <section>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="fullname"
                name="fullname"
                ref={fullName}
                placeholder=" "
                required
              />
              <label htmlFor="fullname">Fullname</label>
            </div>
            <div className="form-group">
              <input
                type="text"
                id="username"
                name="username"
                ref={username}
                placeholder=" "
                required
              />
              <label htmlFor="username">Username</label>
            </div>
            <div className="form-group">
              <input
                type="text"
                name="email"
                ref={email}
                placeholder=" "
                id="email"
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                ref={password}
                placeholder=" "
                id="password"
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <label htmlFor="avatar">Avatar</label>
            <input type="file" name="avatar" ref={avatar} placeholder=" " />
            <div className="form-group">
              <input
                type="text"
                name="phone"
                ref={phone}
                placeholder=" "
                id="phone"
              />
              <label htmlFor="phone">Phone</label>
            </div>
            <div className="gender-group">
              <label htmlFor="gender">Gender: </label>
              <input type="radio" name="gender" ref={male} value="nam" />
              Nam
              <input type="radio" name="gender" ref={female} value="nữ" />
              Nữ
            </div>
            <div className="form-group2">
              <input type="date" name="dateOfBirth" ref={dateOfBirth} />
              <label htmlFor="dateOfBirth">Date Of Birth</label>
            </div>
            <button>Đăng ký</button>
          </form>
        </section>
      </div>
    </>
  );
}
