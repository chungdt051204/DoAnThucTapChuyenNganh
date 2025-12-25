const categoryEntity = require("../../models/category.model");
const courseEntity = require("../../models/course.model");
//Hàm lấy dữ liệu danh mục trong database
exports.getCategory = async (req, res) => {
  try {
    //Lấy id danh mục gửi từ phía client bằng req.query
    const { id } = req.query;
    if (id) {
      const categoryWithId = await categoryEntity.findOne({ _id: id });
      res.status(200).json({ data: categoryWithId });
    }
    const categories = await categoryEntity.find();
    return res.status(200).json({ data: categories });
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm getAllCategories");
    return res.status(500).json({ message: "Lấy dữ liệu danh mục thất bại" });
  }
};
//Hàm thêm danh mục
exports.postCategory = async (req, res) => {
  try {
    //Lấy dữ liệu title gửi từ phía client bằng req.body
    const { title } = req.body;
    await categoryEntity.create({ title });
    return res.status(200).json({ message: "Thêm thành công" });
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm postCategory");
    return res.status(500).json({ message: "Thêm thất bại" });
  }
};
//Hàm cập nhật danh mục
exports.putCategory = async (req, res) => {
  try {
    //Lấy id danh mục gửi từ phía client bằng req.query
    const { id } = req.query;
    //Lấy dữ liệu title gửi từ phía client bằng req.body
    const { title } = req.body;
    //Cập nhật tên danh mục có id bằng id danh mục gửi từ phía client
    await categoryEntity.updateOne({ _id: id }, { title });
    return res.status(200).json({ message: "Sửa thành công" });
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm putCategory");
    return res.status(500).json({ message: "Sửa thất bại" });
  }
};
//Hàm xóa danh mục theo danh mục được chọn
exports.deleteCategory = async (req, res) => {
  try {
    //Lấy id danh mục gửi từ phía client bằng req.query
    const { id } = req.query;
    //Tìm khóa học tồn tại trong danh mục
    const coursesWithCategoryId = await courseEntity.find({ categoryId: id });
    //Nếu danh mục này có tồn tại khóa học thì không thể xóa
    if (coursesWithCategoryId.length > 0) {
      return res
        .status(409)
        .json({ message: "Danh mục này đang có khóa học không thể xóa" });
    } else {
      const result = await categoryEntity.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        // Danh mục không tồn tại để xóa
        return res.status(404).json({
          message: "Không tìm thấy danh mục có mã" + " " + id + " " + "để xóa.",
        });
      }
      // Nếu deletedCount > 0 thông báo thành công
      return res.status(200).json({
        message: "Đã xóa danh mục có mã" + " " + id + " " + "thành công",
      });
    }
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ khi thực hiện xóa.",
    });
  }
};
