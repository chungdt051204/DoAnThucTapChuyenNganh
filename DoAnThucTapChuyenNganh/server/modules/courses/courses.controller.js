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
exports.getCoursesFree = async (req, res) => {
  try {
    const courses = await coursesEntity.find({ isFree: true });
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCoursesFree");
    res.status(500).json({ message: "Lấy dữ liệu khóa học miễn phí thất bại" });
  }
};
exports.getCoursesPre = async (req, res) => {
  try {
    const courses = await coursesEntity.find({ isFree: false });
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCoursesPre");
    res.status(500).json({ message: "Lấy dữ liệu khóa học trả phí thất bại" });
  }
};
exports.getDetailCourse = async (req, res) => {
  try {
    const { id } = req.query;
    const course = await coursesEntity.findOne({ _id: id });
    res.json(course);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getDetailCourse");
    res.status(500).json({ message: "Lấy dữ liệu chi tiết khóa học thất bại" });
  }
};
