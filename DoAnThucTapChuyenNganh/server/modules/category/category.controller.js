const categoryEntity = require("../../models/category.model");
exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryEntity.find();
    res.status(200).json(categories);
  } catch (error) {
    console.log("Có lỗi cảy ra khi xử lý hàm getCategories");
    res.status(500).json({ message: "Lấy dữ liệu danh mục thất bại" });
  }
};
