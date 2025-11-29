const categoryEntity = require("../../models/category.model");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryEntity.find();
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm getAllCategories");
    return res.status(500).json({ message: "Lấy dữ liệu danh mục thất bại" });
  }
};

exports.postCategory = async (req, res) => {
  try {
    const { title } = req.body;
    await categoryEntity.create({ title });
    return res.status(200).json({ message: "Thêm thành công" });
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm postCategory");
    return res.status(500).json({ message: "Thêm thất bại" });
  }
};
exports.getCategoryWithId = async (req, res) => {
  try {
    const { id } = req.query;
    const category = await categoryEntity.findOne({ _id: id });
    res.status(200).json(category);
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm getCategoryWithId");
    return res
      .status(500)
      .json({ message: "Lấy dữ liệu danh mục theo Id thất bại" });
  }
};
exports.putCategory = async (req, res) => {
  try {
    const { id } = req.query;
    const { title } = req.body;
    await categoryEntity.updateOne({ _id: id }, { title });
    return res.status(200).json({ message: "Sửa thành công" });
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm putCategory");
    return res.status(500).json({ message: "Sửa thất bại" });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.query;
    await categoryEntity.deleteOne({ _id: id });
    return res.status(200).json({
      message: "Đã xóa danh mục có mã" + " " + id + " " + "thành công",
    });
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm deleteCategory");
    return res.status(500).json({ message: "Xóa thất bại" });
  }
};
