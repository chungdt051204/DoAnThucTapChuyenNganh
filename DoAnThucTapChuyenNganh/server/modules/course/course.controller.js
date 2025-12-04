const courseEntity = require("../../models/course.model"); //Import courseEntity từ model
exports.getCourses = async (req, res) => {
  try {
    // Lấy id danh mục từ query parameter (tùy chọn)
    const { category_id } = req.query;

    if (category_id) {
      // Nếu có category_id: lọc khóa học theo danh mục
      // populate(): tương tự JOIN trong SQL để lấy thông tin danh mục
      const coursesWithCategoryId = await courseEntity
        .find({ categoryId: category_id })
        .populate("categoryId");
      res.status(200).json(coursesWithCategoryId);
    } else {
      // Không có category_id: lấy tất cả khóa học
      const courses = await courseEntity.find().populate("categoryId");
      res.status(200).json(courses);
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCourses");
    res.status(500).json({ message: "Lấy dữ liệu khóa học thất bại" });
  }
};
//Router lấy dữ liệu các khóa học miễn phí
exports.getCoursesFree = async (req, res) => {
  try {
    // Tìm tất cả khóa học có isFree = true
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
    // Tìm tất cả khóa học có isFree = false
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
    // Lấy id khóa học từ query parameter
    const { id } = req.query;

    // Tìm khóa học có id tương ứng (không populate danh mục)
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
    // Lấy từ khóa tìm kiếm từ query parameter
    const { title } = req.query;

    // Tìm kiếm gần đúng bằng regex (không phân biệt hoa/thường)
    // $regex: biểu thức chính quy
    // $options: "i" = case-insensitive
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
//Router lấy dữ liệu khóa theo id (với populate danh mục)
exports.getCourseWithId = async (req, res) => {
  try {
    // Lấy id khóa học từ query parameter
    const { id } = req.query;

    // Tìm khóa học và populate (lấy) thông tin danh mục
    // populate(): tương tự JOIN trong SQL
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
    // Lấy dữ liệu từ request body
    const { title, categoryId, price } = req.body;
    const image = req.file; // File ảnh từ multer

    // Validation: Kiểm tra đầy đủ dữ liệu
    if (!title || !categoryId || !price || !image) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Tạo object khóa học mới
    // Lưu tên file ảnh vào cả field image và thumbnail (do frontend chỉ gửi 1 file)
    const courseData = {
      title,
      categoryId,
      price: parseFloat(price),
      image: image.filename,
      thumbnail: image.filename,
      isFree: parseFloat(price) === 0, // Đánh dấu khóa học miễn phí nếu giá = 0
    };

    // Lưu vào database
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
    // Lấy id khóa học từ query parameter
    const { id } = req.query;
    // Lấy dữ liệu cập nhật từ request body
    const { title, categoryId, price } = req.body;

    // Validation: Kiểm tra dữ liệu bắt buộc (ảnh là tùy chọn)
    if (!id || !title || !price) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Tạo object dữ liệu cập nhật
    const updateData = {
      title,
      categoryId,
      price: parseFloat(price),
      isFree: parseFloat(price) === 0, // Tự động đánh dấu miễn phí nếu giá = 0
    };

    // Chỉ cập nhật ảnh nếu người dùng gửi file mới
    // Cập nhật cả image và thumbnail từ file ảnh (vì frontend chỉ gửi 1 file)
    if (req.file) {
      updateData.image = req.file.filename;
      updateData.thumbnail = req.file.filename;
    }

    // Cập nhật khóa học trong database
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
    // Lấy id khóa học từ query parameter
    const { id } = req.query;

    // Xóa khóa học khỏi database dựa vào id
    await courseEntity.deleteOne({ _id: id });

    return res.status(200).json({
      message: "Đã xóa khóa học có mã" + " " + id + " " + "thành công",
    });
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm deleteCourse");
    return res.status(500).json({ message: "Xóa thất bại" });
  }
};
