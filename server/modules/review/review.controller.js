const reviewsEntity = require("../../models/review.model");
//Hàm lấy dữ liệu tất cả bình luận trong database
exports.getReview = async (req, res) => {
  try {
    const { course_id } = req.query;
    let query = {};
    if (course_id) {
      query.courseId = course_id;
    }
    const reviews = await reviewsEntity.find(query).populate("userId");
    res.status(200).json({ data: reviews });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getReview");
    res.status(500).json({
      message: "Lấy dữ liệu bình luận thất bại",
      error: error.message,
    });
  }
};
//Hàm xử lý chức năng thêm bình luận
exports.postReview = async (req, res) => {
  try {
    const { body } = req;
    await reviewsEntity.create({ ...body });
    res.status(200).json({ message: "Đăng tải bình luận mới thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postReview");
    res
      .status(500)
      .json({ message: "Đăng tải bình luận thất bại", error: error.message });
  }
};
