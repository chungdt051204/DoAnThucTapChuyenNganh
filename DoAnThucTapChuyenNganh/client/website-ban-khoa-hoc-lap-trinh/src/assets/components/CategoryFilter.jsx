import { useContext } from "react";
import AppContext from "./AppContext";
export default function CategoryFilter({ onCategoryChange, selectedValue }) {
  const { categories } = useContext(AppContext);
  return (
    <>
      <select
        className="category-filter-select"
        value={selectedValue}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Lọc danh mục</option>
        {categories.length > 0 &&
          categories.map((value, index) => {
            return (
              <option key={index} value={value._id}>
                {value.title}
              </option>
            );
          })}
      </select>
    </>
  );
}
