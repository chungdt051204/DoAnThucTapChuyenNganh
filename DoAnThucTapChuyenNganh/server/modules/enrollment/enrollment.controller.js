const enrollmentEntity = require("../../models/enrollment.model");
exports.getEnrollment = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (user_id) {
      const enrollmentsWithUserId = await enrollmentEntity
        .find({
          userId: user_id,
        })
        .populate("courseId");
      res.status(200).json({ data: enrollmentsWithUserId });
    }
  } catch (error) {}
};
exports.postEnrollment = async (req, res) => {
  try {
    const { body } = req;
    await enrollmentEntity.create({ ...body });
    res.status(200).json({ message: "Đăng ký học thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postEnrollment");
    res
      .status(500)
      .json({ message: "Đăng ký học thất bại", error: error.message });
  }
};
