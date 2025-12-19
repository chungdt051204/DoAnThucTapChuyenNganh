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
