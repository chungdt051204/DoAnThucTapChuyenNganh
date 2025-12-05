const courseEntity = require("../../models/course.model"); //Import courseEntity từ model
const orderItemEntity = require("../../models/orderItem.model");
exports.getCourses = async (req, res) => {
  try {
    //Lấy id danh mục từ chuỗi query String nhận được bên phía client bằng req.query
    const { category_id } = req.query;
    //Lấy id khóa học từ chuỗi query String nhận được bên phía client bằng req.query
    const { id } = req.query;
    if (category_id) {
      //Nếu có category_id thì lọc theo danh mục
      const coursesWithCategoryId = await courseEntity
        .find({ categoryId: category_id })
        .populate("categoryId"); //populate tương tự JOIN bên sql
      res.status(200).json(coursesWithCategoryId); //Gửi dữ liệu về cho phía client
    } else if (id) {
      //Nếu có id thì lọc theo id của khóa học
      const coursesWithId = await courseEntity
        .findOne({ _id: id })
        .populate("categoryId"); //populate tương tự JOIN bên sql
      res.status(200).json(coursesWithId); //Gửi dữ liệu về cho phía client
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
//Router thêm khóa học mới
exports.postCourse = async (req, res) => {
  try {
    // Lấy dữ liệu từ request body
    const { title, categoryId, price } = req.body;
    // Lưu vào database
    await courseEntity.create({
      title: title,
      categoryId: categoryId,
      price: price,
      image: req.file && req.file.filename,
      isFree: parseFloat(price) === 0, //Là khóa học miễn phí nếu giá = 0
    });
    res.status(200).json({ message: "Thêm khóa học thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi thêm khóa học:", error);
    res.status(500).json({ message: "Thêm khóa học thất bại" });
  }
};
//Router cập nhật khóa học
exports.putCourse = async (req, res) => {
  try {
    //Lấy và Chuẩn bị Dữ liệu
    const { title, categoryId, price } = req.body; // Lấy dữ liệu cập nhật từ body
    const { id } = req.query; // Lấy ID khóa học cần cập nhật từ query string
    // Xử lý Dữ liệu Cũ và Mới
    //Tìm kiếm document cũ để lấy các giá trị mặc định/cũ (nếu form gửi lên rỗng)
    const courseWithId = await courseEntity.findOne({ _id: id });
    // Nếu không tìm thấy khóa học thì báo lỗi
    if (!courseWithId) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khóa học để sửa" });
    } else {
      // Thực hiện lệnh Cập nhật Document (updateOne)
      const result = await courseEntity.updateOne(
        { _id: id }, // Điều kiện tìm kiếm (Tìm khóa học bằng ID)
        {
          // Logic giữ giá trị cũ nếu giá trị mới là rỗng ("")
          title: title === "" ? courseWithId.title : title,
          categoryId: categoryId === "" ? courseWithId.categoryId : categoryId,
          price: price === "" ? courseWithId.price : price,
          isFree: parseFloat(price) === 0,
          // Logic xử lý File: Nếu có file mới (req.file) thì dùng filename mới,
          image: req.file ? req.file.filename : courseWithId.image,
        }
      );
      // Xử lý Kết quả Cập nhật
      if (result.modifiedCount === 0) {
        // Xử lý không tìm thấy: Trả về 404 Not Found
        return res.status(404).json({
          message: "Không tìm thấy khóa học có mã" + " " + id + " " + "để sửa.",
        });
      } else {
        // Xử lý thành công (modifiedCount > 0)
        return res
          .status(200)
          .json({ message: "Cập nhật khóa học thành công" });
      }
    }
  } catch (error) {
    // Xử lý lỗi hệ thống
    console.log("Có lỗi xảy ra khi cập nhật khóa học:", error);
    res.status(500).json({ message: "Cập nhật khóa học thất bại" });
  }
};
//Router xóa khóa học được chọn
exports.deleteCourse = async (req, res) => {
  try {
    // Lấy id khóa học từ query parameter
    const { id } = req.query;
    //Tìm kiếm khóa học trong giỏ hàng
    const courseInOrdersItems = await orderItemEntity.find({ courseId: id });
    //Nếu khóa học có tồn tại trong giỏ hàng của bất kỳ người dùng nào thì không thể xóa
    if (courseInOrdersItems.length > 0) {
      return res.status(409).json({
        message:
          "Khóa học này hiện đang trong giỏ hàng của người dùng, không thể xóa",
      });
    } else {
      // Xóa khóa học khỏi database dựa vào id
      await courseEntity.deleteOne({ _id: id });
      return res.status(200).json({
        message: "Đã xóa khóa học có mã" + " " + id + " " + "thành công",
      });
    }
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi hàm deleteCourse");
    return res.status(500).json({ message: "Xóa thất bại" });
  }
};
