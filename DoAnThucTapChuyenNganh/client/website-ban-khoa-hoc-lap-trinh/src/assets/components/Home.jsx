import UserNavBar from "./UserNavBar";
import { useContext } from "react";
import AppContext from "./AppContext";
import Carousel from "./Carousel";

export default function Home() {
  const { user, isLogin } = useContext(AppContext);

  return (
    <>
      <UserNavBar />
      {isLogin && <h2>Xin chào {user.username}</h2>}
      <Carousel />
    </>
  );
}
