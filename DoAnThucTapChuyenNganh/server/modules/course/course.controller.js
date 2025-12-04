const courseEntity = require("../../models/course.model"); //Import courseEntity từ model
exports.getCourses = async (req, res) => {
  try {
    //Lấy id danh mục từ chuỗi query String nhận được bên phía client bằng req.query
    const { category_id } = req.query;
    if (category_id) {
      //Nếu có category_id thì lọc theo danh mục
      const coursesWithCategoryId = await courseEntity
        .find({ categoryId: category_id })
        .populate("categoryId"); //populate tương tự JOIN bên sql
      res.status(200).json(coursesWithCategoryId); //Gửi dữ liệu về cho phía client
    } else {
      //Không có query String thì lấy tất cả
      const courses = await courseEntity.find().populate("categoryId"); //populate tương tự JOIN bên sql
      res.status(200).json(courses); //Gửi dữ liệu về cho phía client
    }
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
//Router lấy dữ liệu khóa theo id
exports.getCourseWithId = async (req, res) => {
  try {
    //Lấy id khóa học gửi từ phía client bằng req.query
    const { id } = req.query;
    //Tìm kiếm khóa học có id bằng id khóa học gửi từ phía client
    const course = await courseEntity
      .findOne({ _id: id })
      .populate("categoryId");
    res.status(200).json(course);
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm getCourseWithId");
    return res
      .status(500)
      .json({ message: "Lấy dữ liệu khóa học theo Id thất bại" });
  }
};
//Router thêm khóa học mới
exports.postAddCourse = async (req, res) => {
  try {
    const { title, categoryId, price } = req.body;
    const image = req.file;

    // Validate input
    if (!title || !categoryId || !price || !image) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Create new course
    const courseData = {
      title,
      categoryId,
      price: parseFloat(price),
      image: image.filename,
      thumbnail: image.filename,
      isFree: parseFloat(price) === 0,
    };

    await courseEntity.create(courseData);
    res.status(200).json({ message: "Thêm khóa học thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi thêm khóa học:", error);
    res.status(500).json({ message: "Thêm khóa học thất bại" });
  }
};
//Router cập nhật khóa học
exports.putUpdateCourse = async (req, res) => {
  try {
    const { id } = req.query;
    const { title, categoryId, price } = req.body;
    const { image, thumbnail } = req.files || {};

    // Validate input
    if (!id || !title || !price) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Update course data
    const updateData = {
      title,
      categoryId,
      price: parseFloat(price),
      isFree: parseFloat(price) === 0,
    };

    if (image) updateData.image = image[0].filename;
    if (thumbnail) updateData.thumbnail = thumbnail[0].filename;

    await courseEntity.updateOne({ _id: id }, updateData);
    res.status(200).json({ message: "Cập nhật khóa học thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi cập nhật khóa học:", error);
    res.status(500).json({ message: "Cập nhật khóa học thất bại" });
  }
};
//Router xóa khóa học được chọn
exports.deleteCourse = async (req, res) => {
  try {
    //Lấy id khóa học gửi từ phía client bằng req.query
    const { id } = req.query;
    //Xóa khóa học được chọn dựa vào id gửi từ phía client
    await courseEntity.deleteOne({ _id: id });
    return res.status(200).json({
      message: "Đã xóa khóa học có mã" + " " + id + " " + "thành công",
    });
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm deleteCourse");
    return res.status(500).json({ message: "Xóa thất bại" });
  }
};
