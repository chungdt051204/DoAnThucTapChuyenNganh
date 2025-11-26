import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GetCoursesWithQueryString from "./GetCoursesWithQueryString";
import UserNavBar from "./UserNavBar";
import Footer from "./Footer";
export default function GetCoursesWithCategory_Id() {
  const [searchParams] = useSearchParams();
  const category_id = searchParams.get("category_id");
  const [coursesWithCategory_Id, setCoursesWithCategory_Id] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3000/courses/category?category_id=${category_id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setCoursesWithCategory_Id(data);
      });
  }, [category_id]);
  return (
    <>
      <UserNavBar></UserNavBar>
      <h2>Tìm thấy {coursesWithCategory_Id.length} khóa học</h2>
      <GetCoursesWithQueryString
        data={coursesWithCategory_Id}
      ></GetCoursesWithQueryString>
      <Footer></Footer>
    </>
  );
}
