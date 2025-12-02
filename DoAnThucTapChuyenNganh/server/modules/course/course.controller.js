const courseEntity = require("../../models/course.model");
//Router lấy dữ liệu tất cả khóa học trong database
exports.getCourses = async (req, res) => {
  try {
    const courses = await courseEntity.find();
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCourses");
    res.status(500).json({ message: "Lấy dữ liệu khóa học thất bại" });
  }
};
//Router lấy dữ liệu các khóa học miễn phí
exports.getCoursesFree = async (req, res) => {
  try {
    //Tìm các khóa học có isFree = true
    const courses = await courseEntity.find({ isFree: true });
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCoursesFree");
    res.status(500).json({ message: "Lấy dữ liệu khóa học miễn phí thất bại" });
  }
};
//Router lấy dữ liệu các khóa học trả phí
exports.getCoursesPre = async (req, res) => {
  try {
    //Tìm các khóa học có isFree = false
    const courses = await courseEntity.find({ isFree: false });
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCoursesPre");
    res.status(500).json({ message: "Lấy dữ liệu khóa học trả phí thất bại" });
  }
};
//Router lấy dữ liệu chi tiết khóa học dựa vào id khóa học
exports.getDetailCourse = async (req, res) => {
  try {
    //Lấy id khóa học từ chuỗi query String nhận được bên phía client bằng req.query
    const { id } = req.query;
    //Tìm khóa học có id bằng id khóa học gửi từ phía client
    const course = await courseEntity.findOne({ _id: id });
    res.status(200).json(course);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getDetailCourse");
    res.status(500).json({ message: "Lấy dữ liệu chi tiết khóa học thất bại" });
  }
};
//Router lọc khóa học theo danh mục
exports.getCoursesWithCategory_Id = async (req, res) => {
  try {
    //Lấy id danh mục từ chuỗi query String nhận được bên phía client bằng req.query
    const { category_id } = req.query;
    //Tìm kiếm các khóa học có categoryId bằng id danh mục gửi từ phía client
    const courses = await courseEntity.find({ categoryId: category_id });
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCoursesWithCategory_Id");
    res
      .status(500)
      .json({ message: "Lấy dữ liệu khóa học theo danh mục thất bại" });
  }
};
//Tìm kiếm gần đúng các khóa học dựa vào gợi ý tìm kiếm
exports.getCoursesWithSearchSuggestion = async (req, res) => {
  try {
    //Lấy dữ liệu title từ từ chuỗi query String nhận được bên phía client bằng req.query
    const { title } = req.query;
    //Tìm kiếm gần đúng các khóa học có title chứa chuỗi query String gửi từ phía client
    const courses = await courseEntity.find({
      title: { $regex: title, $options: "i" }, //$regex cho phép nhận biểu thức, $options: "i"
      //không phân biệt hoa thường
    });
    res.status(200).json(courses);
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCoursesWithSearchSuggestion");
    res.status(500).json({
      message: "Lấy dữ liệu khóa học dựa trên gợi ý tìm kiếm thất bại",
    });
  }
};
