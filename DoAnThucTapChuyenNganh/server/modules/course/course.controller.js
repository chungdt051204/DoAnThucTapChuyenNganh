const courseEntity = require("../../models/course.model");
exports.getCourses = async (req, res) => {
  try {
    const courses = await courseEntity.find();
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCourses");
    res.status(500).json({ message: "Lấy dữ liệu khóa học thất bại" });
  }
};
exports.getCoursesFree = async (req, res) => {
  try {
    const courses = await courseEntity.find({ isFree: true });
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCoursesFree");
    res.status(500).json({ message: "Lấy dữ liệu khóa học miễn phí thất bại" });
  }
};
exports.getCoursesPre = async (req, res) => {
  try {
    const courses = await courseEntity.find({ isFree: false });
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCoursesPre");
    res.status(500).json({ message: "Lấy dữ liệu khóa học trả phí thất bại" });
  }
};
exports.getDetailCourse = async (req, res) => {
  try {
    const { id } = req.query;
    const course = await courseEntity.findOne({ _id: id });
    res.status(200).json(course);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getDetailCourse");
    res.status(500).json({ message: "Lấy dữ liệu chi tiết khóa học thất bại" });
  }
};
exports.getCoursesWithCategory_Id = async (req, res) => {
  try {
    const { category_id } = req.query;
    const courses = await courseEntity.find({ categoryId: category_id });
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCoursesWithCategory_Id");
    res
      .status(500)
      .json({ message: "Lấy dữ liệu khóa học theo danh mục thất bại" });
  }
};
exports.getCoursesWithSearchSuggestion = async (req, res) => {
  try {
    const { title } = req.query;
    const courses = await courseEntity.find({
      title: { $regex: title, $options: "i" },
    });
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCoursesWithSearchSuggestion");
    res.status(500).json({
      message: "Lấy dữ liệu khóa học dựa trên gợi ý tìm kiếm thất bại",
    });
  }
};
