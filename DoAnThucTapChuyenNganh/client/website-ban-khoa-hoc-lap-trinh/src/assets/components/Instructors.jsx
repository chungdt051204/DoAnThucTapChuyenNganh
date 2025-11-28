import { useEffect, useState } from "react";

export default function Instructor() {
  const [instructor, setInstructors] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/instructors")
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      }) //lấy dữ liệu trên DB

      .then((data) => {
        setInstructors(data);
      }) //
      .catch(console.error);
  }, []);
  return (
    <>
      <section>
        {instructor.length > 0 ? ( //mảng lớn hơn 0 ? hiển thi danh sách : báo mảng rỗng
          instructor.map((value, index) => {
            // lặp các ptử mảng instructor, map tạo ra các div
            return (
              // return một element, react sẽ render tất cả ra giao diện

              //key giúp React nhận biết phần tử nào bị thay đổi khi re-render.
              <div key={index}>
                <img
                  src={
                    //gán hình
                    value.avatar.includes("https")
                      ? value.avatar
                      : `http://localhost:3000/images/${value.avatar}`
                  }
                  alt=""
                  width={150}
                  height={200}
                />
                <p>{value.username}</p>
                {/* gán tên */}
              </div>
            );
          })
        ) : (
          <h2>Danh sách giảng viên hiện đang trống</h2>
        )}
      </section>
    </>
  );
}
