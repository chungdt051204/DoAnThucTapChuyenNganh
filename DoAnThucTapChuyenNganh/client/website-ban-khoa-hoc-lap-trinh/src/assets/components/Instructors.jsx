import { useEffect, useState } from "react";

export default function Instructor() {
  const [instructor, setInstructors] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/instructors")
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setInstructors(data);
      })
      .catch();
  });
  return (
    <>
      <section>
        {instructor.length > 0 ? (
          instructor.map((value, index) => {
            return (
              <div key={index}>
                <img
                  src={
                    value.avatar.includes("https")
                      ? value.avatar
                      : `http://localhost:3000/images/${value.avatar}`
                  }
                  alt=""
                  width={150}
                  height={200}
                />
                <p>{value.username}</p>
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
