import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { url } from "../../App";
import "../styles/Auth.css";

const registerSchema = z
  .object({
    fullname: z.string().min(1, "Họ tên không được bỏ trống"),
    username: z.string().min(5, "Tên đăng nhập phải có tối thiểu 5 ký tự"),
    email: z.string().email("Email không đúng định dạng"),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    verifyPassword: z.string(),
    phone: z
      .string()
      .min(1, "Số điện thoại không được để trống")
      .regex(
        /^(0[3|5|7|8|9])([0-9]{8})$/,
        "Số điện thoại không đúng định dạng Việt Nam"
      ),
    dateOfBirth: z
      .string()
      .refine((data) => data !== "", "Vui lòng chọn ngày sinh"),
    gender: z.string().refine((data) => data !== "", "Vui lòng chọn giới tính"),
  })
  .refine((data) => data.password !== data.username, {
    message: "Mật khẩu không được trùng với tên đăng nhập",
    path: ["password"],
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Mật khẩu không khớp",
    path: ["verifyPassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const [emailNotValid, setEmailNotValid] = useState("");
  const [avatarNotValid, setAvatarNotValid] = useState("");
  const avatar = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      verifyPassword: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
    },
    mode: "onTouched",
  });

  // Hàm xử lý đăng ký
  const onSubmit = (data) => {
    if (!avatar.current || !avatar.current.files[0]) {
      setAvatarNotValid("Vui lòng chọn file");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);
    formData.append("gender", data.gender);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("avatar", avatar.current.files[0]);

    fetch(`${url}/register`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch(async (err) => {
        if (err.status === 400) {
          const { message } = await err.json();
          setEmailNotValid(message);
        }
      });
  };

  return (
    <>
      <div className="auth-page">
        <div className="formAuth">
          <h2>Register</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                {...register("fullname")}
                type="text"
                placeholder=""
                autoComplete="off"
              />
              <label htmlFor="fullname">Fullname</label>
            </div>
            <span>{errors?.fullname?.message}</span>

            <div className="form-group">
              <input
                {...register("username")}
                type="text"
                placeholder=""
                autoComplete="off"
              />
              <label htmlFor="username">Username</label>
            </div>
            <span>{errors?.username?.message}</span>

            <div className="form-group">
              <input
                {...register("email")}
                type="text"
                placeholder=""
                autoComplete="off"
              />
              <label htmlFor="email">Email</label>
            </div>
            <span>{errors?.email?.message}</span>
            {emailNotValid && <span>{emailNotValid}</span>}

            <div className="form-group">
              <input
                {...register("password")}
                type="password"
                placeholder=""
                autoComplete="new-password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <span>{errors?.password?.message}</span>

            <div className="form-group">
              <input
                {...register("verifyPassword")}
                type="password"
                placeholder=""
              />
              <label htmlFor="verifyPassword">Verify password</label>
            </div>
            <span>{errors?.verifyPassword?.message}</span>

            <div className="form-group">
              <input
                {...register("phone")}
                type="text"
                placeholder=""
                autoComplete="off"
              />
              <label htmlFor="phone">Phone</label>
            </div>
            <span>{errors?.phone?.message}</span>

            <div className="form-group">
              <input
                {...register("dateOfBirth")}
                type="date"
                name="dateOfBirth"
              />
              <label htmlFor="dateOfBirth">Date Of Birth</label>
            </div>
            <span>{errors?.dateOfBirth?.message}</span>

            <div className="gender-group">
              <label htmlFor="gender">Gender: </label>
              <input {...register("gender")} type="radio" value="nam" /> Nam
              <input {...register("gender")} type="radio" value="nữ" /> Nữ
            </div>
            <span>{errors?.gender?.message}</span>

            <div className="avatar-group">
              <input
                type="file"
                name="avatar"
                ref={avatar}
                className="custom-file-input"
                accept=".jpg, .jpeg, .png"
              />
            </div>
            {avatarNotValid && <span>{avatarNotValid}</span>}

            <button>Đăng ký</button>
          </form>
        </div>
      </div>
    </>
  );
}
