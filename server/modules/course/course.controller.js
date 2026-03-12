const courseEntity = require("../../models/course.model");
const orderEntity = require("../../models/order.model");
const enrollmentEntity = require("../../models/enrollment.model");
//Hàm xử lý chức năng lấy danh sách khóa học
exports.getCourse = async (req, res) => {
  try {
    const arrayCourse = await courseEntity.find();
    const {
      _page = 1,
      _limit = arrayCourse?.length,
      id,
      category_id,
      search,
      price,
    } = req.query;
    const options = {
      page: _page,
      limit: _limit,
      populate: "categoryId",
    };
    if (id) {
      const coursesWithId = await courseEntity
        .findOne({ _id: id })
        .populate("categoryId"); //populate tương tự JOIN bên sql
      return res.status(200).json({ data: coursesWithId });
    }
    let query = {};
    if (category_id) {
      query.categoryId = category_id;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
      // Tìm kiếm gần đúng bằng regex (không phân biệt hoa/thường)
    }
    if (price) {
      if (price === "low") query.price = { $lte: 200000 };
      if (price === "medium") query.price = { $gte: 200000, $lte: 400000 };
      if (price === "high") query.price = { $gte: 400000 };
    }
    const coursesWithQueryString = await courseEntity.paginate(query, options);
    return res.status(200).json({ data: coursesWithQueryString });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getCourses");
    return res
      .status(500)
      .json({ message: "Lấy dữ liệu khóa học thất bại", error: error.message });
  }
};
//Hàm xử lý thêm khóa học mới
exports.postCourse = async (req, res) => {
  try {
    const { title, categoryId, price } = req.body;
    await courseEntity.create({
      title: title,
      categoryId: categoryId,
      price: price,
      image: req.files["image"] && req.files["image"][0].path,
      thumbnail: req.files["thumbnail"] && req.files["thumbnail"][0].path,
      isFree: parseFloat(price) === 0,
    });
    res.status(200).json({ message: "Thêm khóa học thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi thêm khóa học:", error);
    res.status(500).json({ message: "Thêm khóa học thất bại" });
  }
};
//Hàm xử lý cập nhật khóa học
exports.putCourse = async (req, res) => {
  try {
    const { title, categoryId, price } = req.body;
    const { id } = req.query;
    //Tìm kiếm document cũ để lấy các giá trị mặc định/cũ (nếu form gửi lên rỗng)
    const courseWithId = await courseEntity.findOne({ _id: id });
    // Nếu không tìm thấy khóa học thì báo lỗi
    if (!courseWithId) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khóa học để sửa" });
    } else {
      // Thực hiện lệnh cập nhật
      const result = await courseEntity.updateOne(
        { _id: id },
        {
          // Logic giữ giá trị cũ nếu giá trị mới là rỗng ("")
          title: title === "" ? courseWithId.title : title,
          categoryId: categoryId === "" ? courseWithId.categoryId : categoryId,
          price: price === "" ? courseWithId.price : price,
          isFree: parseFloat(price) === 0,
          // Logic xử lý File: Nếu có file mới (req.file) thì dùng filename mới,
          image: req.files["image"]
            ? req.files["image"][0].filename
            : courseWithId.image,
          thumbnail: req.files["thumbnail"]
            ? req.files["thumbnail"][0].filename
            : courseWithId.thumbnail,
        }
      );
      // Xử lý kết quả Cập nhật
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
    res
      .status(500)
      .json({ message: "Cập nhật khóa học thất bại", error: error.message });
  }
};
//Hàm xử lý xóa khóa học được chọn
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.query;
    //Tìm kiếm khóa học trong đơn hàng
    const courseInOrdersItems = await orderEntity.find({
      "items.courseId": id,
    });
    //Tìm kiếm khóa học trong enrollment
    const courseInEnrollment = await enrollmentEntity.find({
      courseId: id,
    });
    if (!id) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học để xóa",
      });
    }
    //Nếu khóa học có tồn tại trong đơn hàng của bất kỳ người dùng nào thì không thể xóa
    if (courseInOrdersItems.length > 0) {
      return res.status(409).json({
        message:
          "Khóa học này hiện đang trong đơn hàng của người dùng, không thể xóa",
      });
    }
    //Nếu khóa học có tồn tại trong enrollment (người dùng đã sở hữu khóa học) thì không thể xóa
    if (courseInEnrollment.length > 0) {
      return res.status(409).json({
        message: "Khóa học này đã được người dùng sở hữu, không thể xóa",
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
    return res
      .status(500)
      .json({ message: "Xóa thất bại", error: error.message });
  }
};
