const coursesEntity = require("../../models/course.model");
exports.getCourses = async (req, res) => {
  try {
    const courses = await coursesEntity.find();
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCourses");
    res.status(500).json({ message: "Lấy dữ liệu khóa học thất bại" });
  }
};
