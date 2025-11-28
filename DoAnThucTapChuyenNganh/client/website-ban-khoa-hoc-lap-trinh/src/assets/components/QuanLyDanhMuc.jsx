import React from "react";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import CategoriesList from "./CategoriesList";
import CategoriesAction from "./CategoriesAction";
import AddData from "./AddData";

const QuanLyDanhMuc = () => {
  return (
    <>
      <AdminNavBar />
      <AddData />
      <table>
        <tr>
          <th>Danh mục</th>
          <th>Hành động</th>
        </tr>
        <tr>
          <td>
            {/* Danh sách danh mục */}
            <CategoriesList />
          </td>
          <td>
            {/* Chức năng */}
            <CategoriesAction />
          </td>
        </tr>
      </table>

      <Footer />
    </>
  );
};

export default QuanLyDanhMuc;
