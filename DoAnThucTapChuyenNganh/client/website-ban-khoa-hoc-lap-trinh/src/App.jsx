import { Routes, Route } from "react-router-dom";
import AppContext from "./assets/components/AppContext";
import Home from "./assets/components/Home";
import Login from "./assets/components/Login";
import Register from "./assets/components/Register";

function App() {
  return (
    <>
      <AppContext.Provider value={{}}>
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
