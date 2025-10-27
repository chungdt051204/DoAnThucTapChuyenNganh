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
      <section>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullname">Fullname</label>
          <input
            type="text"
            name="fullName"
            ref={fullName}
            placeholder="Fullname"
          />
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            ref={username}
            placeholder="Username"
          />
          <label htmlFor="email">Email</label>
          <input type="text" name="email" ref={email} placeholder="Email" />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            ref={password}
            placeholder="Password"
          />
          <label htmlFor="avatar">Avatar</label>
          <input type="file" name="avatar" ref={avatar} />
          <label htmlFor="phone">Phone</label>
          <input type="text" name="phone" ref={phone} placeholder="Phone" />
          <label htmlFor="gender">Gender</label>
          <input type="radio" name="gender" ref={male} value="nam" />
          Nam
          <input type="radio" name="gender" ref={female} value="nữ" />
          Nữ
          <label htmlFor="dateOfBirth">Date Of Birth</label>
          <input type="date" name="dateOfBirth" ref={dateOfBirth} />
          <button>Đăng ký</button>
        </form>
      </section>
    </>
  );
}
