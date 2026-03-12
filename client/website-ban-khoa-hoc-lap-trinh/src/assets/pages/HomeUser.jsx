import UserNavBar from "../components/UserNavBar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import CoursesFree from "../components/CoursesFree";
import CoursesPre from "../components/CoursesPre";

export default function HomeUser() {
  return (
    <>
      <UserNavBar />
      <Carousel />
      <CoursesFree />
      <CoursesPre />
      <Footer />
    </>
  );
}
