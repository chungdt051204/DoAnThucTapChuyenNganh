import { Routes, Route } from "react-router-dom";
import AppContext from "./assets/components/AppContext";
import Home from "./assets/components/Home";

function App() {
  return (
    <>
      <AppContext.Provider value={{}}>
        <Routes>
          <Route path="/" element={<Home></Home>} />
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export default App;
