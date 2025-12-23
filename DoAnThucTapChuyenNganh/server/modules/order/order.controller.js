const cartEntity = require("../../models/cart.model");
const orderEntity = require("../../models/order.model");
const enrollmentEntity = require("../../models/enrollment.model");
exports.postOrder = async (req, res) => {
  try {
    const { body } = req;
    const courseItem = body.orderItemSelected.map((value, index) => {
      return {
        courseId: value.courseId._id,
        courseName: value.courseId.title,
        coursePrice: value.courseId.price,
      };
    });
    //Tao don hang
    await orderEntity.create({
      userId: body.userId,
      fullName: body.fullName,
      phone: body.phone,
      items: courseItem,
      totalAmount: body.totalAmount,
    });
    //Them cac khoa hoc da mua vao enrollment
    await body.orderItemSelected.forEach((value) => {
      enrollmentEntity.create({
        userId: body.userId,
        courseId: value.courseId._id,
      });
    });
    const orderItemId = body.orderItemSelected.map((value) => {
      return value._id;
    });
    //Xoa cac khoa hoc da mua khoi gio hang
    await cartEntity.updateOne(
      { userId: body.userId },
      {
        $pull: {
          items: { _id: { $in: orderItemId } },
        },
      }
    );
    await res.status(200).json({ message: "Thanh toan thanh cong" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postOrder");
    res.status(500).json({ message: "Thanh toan that bai" });
  }
};
exports.getOrders = async (req, res) => {
  try {
    const { user_id } = req.query;
    const { order_id } = req.query;
    if (order_id) {
      const orderWithOrderId = await orderEntity
        .findOne({ _id: order_id })
        .populate("items.courseId");
      res.status(200).json({ data: orderWithOrderId });
    } else if (user_id) {
      const ordersWithUserId = await orderEntity.find({ userId: user_id });
      res.status(200).json({ data: ordersWithUserId });
    } else {
      const orders = await orderEntity.find();
      res.status(200).json({ data: orders });
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getOrder");
    res.status(500).json({ message: "Lấy dữ liệu đơn hàng thất bại" });
  }
};
exports.getDailyRevenue = async (req, res) => {
  const dailyRevenue = await orderEntity.aggregate([
    {
      //Toán tử $group để nhóm dữ liệu
      $group: {
        //Điều kiện nhóm: _id là ngày tạo đơn hàng
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        //Tính tổng tiền theo điều kiện nhóm
        totalAmount: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } }, //Sắp xếp tăng dần theo ngày mua
  ]);
  res.status(200).json({ data: dailyRevenue });
};
exports.getBestSellerCourses = async (req, res) => {
  const bestSellerCourses = await orderEntity.aggregate([
    //Trải phẳng mảng items (nếu items là array)
    { $unwind: "$items" },
    {
      //Nhóm theo mã khóa học
      $group: {
        _id: "$items.courseId",
        courseName: { $first: "$items.courseName" }, // Lấy tên đầu tiên tìm thấy trong nhóm
        totalSold: { $sum: 1 },
      },
    },
    //Lấy giới hạn 5 khóa học bán được nhiều nhất
    {
      $limit: 5,
    },
  ]);
  res.status(200).json({ data: bestSellerCourses });
};
