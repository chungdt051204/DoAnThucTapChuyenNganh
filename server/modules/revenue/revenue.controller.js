const dayjs = require("dayjs");
const revenueEntity = require("../../models/revenue.model");

exports.getRevenue = async (req, res) => {
  try {
    const { option } = req.query;
    let revenues = [];
    if (option == 1) {
      const start = dayjs().startOf("day").toDate();
      const end = dayjs().endOf("day").toDate();
      revenues = await revenueEntity.find({
        createdAt: { $gte: start, $lte: end },
      });
    }
    if (option == 2) {
      //Lấy điểm bắt đầu là 7 ngày trước
      const startOfLastWeek = dayjs()
        .subtract(7, "day")
        .startOf("day")
        .toDate();
      //Lấy điểm kết thúc là cuối hôm nay
      const endOfToday = dayjs().endOf("day").toDate();
      revenues = await revenueEntity.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfLastWeek, $lte: endOfToday },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Nhóm theo chuỗi YYYY-MM-DD
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
    }
    return res.json({ data: revenues });
  } catch (error) {}
};
