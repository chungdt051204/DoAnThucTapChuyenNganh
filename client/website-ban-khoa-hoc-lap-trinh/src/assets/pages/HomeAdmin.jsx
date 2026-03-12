import Footer from "../components/Footer";
import AdminNavBar from "../components/AdminNavBar";
import DashBoard from "./Dashboard";

export default function HomeAdmin() {
  return (
    <>
      <AdminNavBar></AdminNavBar>
      <DashBoard />
      <Footer />
    </>
  );
}
