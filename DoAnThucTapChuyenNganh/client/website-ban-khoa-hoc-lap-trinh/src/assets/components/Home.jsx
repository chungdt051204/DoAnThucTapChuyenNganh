import UserNavBar from "./UserNavBar";
import { useContext } from "react";
import AppContext from "./AppContext";
import Carousel from "./Carousel";
import Footer from "./Footer";
import CoursesFree from "./CoursesFree";
import CoursesPre from "./CoursesPre";

export default function Home() {
  const { user, isLogin } = useContext(AppContext);

  return (
    <>
      <UserNavBar />
      {isLogin && <h2>Xin chào {user.username}</h2>}
      <Carousel />
      <CoursesFree />
      <CoursesPre />
      <Footer />
    </>
  );
}
