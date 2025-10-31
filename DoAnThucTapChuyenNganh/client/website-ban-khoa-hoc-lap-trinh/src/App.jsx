import { Routes, Route } from "react-router-dom";
import AppContext from "./assets/components/AppContext";
import Home from "./assets/components/Home";
import Login from "./assets/components/Login";
import Register from "./assets/components/Register";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    fetch("http://localhost:3000/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setIsLogin(true);
        setUser(data);
      });
  }, []);
  return (
    <>
      <AppContext.Provider value={{ user, isLogin, setIsLogin }}>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/login" element={<Login></Login>} />
          <Route path="/register" element={<Register></Register>} />
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export default App;
