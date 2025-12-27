const cartEntity = require("../../models/cart.model");
const orderEntity = require("../../models/order.model");
const enrollmentEntity = require("../../models/enrollment.model");
//Hàm xử lý tạo đơn hàng
exports.postOrder = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phone,
      orderItemSelected,
      totalAmount,
      remainingAmount,
      status,
    } = req.body;
    const orderItemId = orderItemSelected.map((value) => {
      return value.orderItemId;
    });
    //Tạo đơn hàng
    await orderEntity.create({
      userId: userId,
      fullName: fullName,
      phone: phone,
      items: orderItemSelected,
      totalAmount: totalAmount,
      remainingAmount: remainingAmount,
      status: status,
    });
    // Tạo enrollment (Dùng Promise.all để đợi tất cả hoàn thành)
    const enrollmentPromises = orderItemSelected.map((value) => {
      return enrollmentEntity.create({
        userId: userId,
        courseId: value.courseId,
        accessLevel: value.paymentType === "PARTIAL" ? "LIMITED" : "UNLIMITED",
      });
    });
    // Chờ tất cả các bản ghi enrollment được tạo xong
    await Promise.all(enrollmentPromises);
    //Xoá các khóa học đã mua khỏi giỏ hàng
    await cartEntity.updateOne(
      { userId: userId },
      {
        $pull: {
          items: { _id: { $in: orderItemId } },
        },
      }
    );
    return res.status(200).json({ message: "Thanh toán thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postOrder");
    res.status(500).json({ message: "Thanh toan that bai" });
  }
};
//Hàm lấy dữ liệu đơn hàng
exports.getOrders = async (req, res) => {
  try {
    const { order_id } = req.query;
    const { user_id } = req.query;
    const { status } = req.query;
    let query = {};
    if (order_id) {
      const orderWithOrderId = await orderEntity
        .findOne({ _id: order_id })
        .populate("items.courseId");
      res.status(200).json({ data: orderWithOrderId });
    }
    if (user_id) {
      query.userId = user_id;
    }
    if (status) {
      query.status = status;
    }
    const orders = await orderEntity.find(query).populate("items.courseId");
    return res.status(200).json({ data: orders });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getOrder");
    res.status(500).json({ message: "Lấy dữ liệu đơn hàng thất bại" });
  }
};
//Hàm cập nhật trạng thái đơn hàng
exports.putStatusOrder = async (req, res) => {
  try {
    const { id } = req.query;
    const { userId } = req.body;
    const { courseIdWithOrderItem } = req.body;
    if (id) {
      //Cập nhật trạng thái đơn hàng
      const result = await orderEntity.updateOne(
        { _id: id },
        { status: "success" }
      );
      if (result.modifiedCount === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy đơn hàng để cập nhật trạng thái" });
      }
      // Tạo enrollment (Dùng Promise.all để đợi tất cả hoàn thành)
      else if (courseIdWithOrderItem && Array.isArray(courseIdWithOrderItem)) {
        const enrollmentPromises = courseIdWithOrderItem.map((courseId) => {
          return enrollmentEntity.create({
            userId: userId,
            courseId: courseId,
          });
        });
      }
      return res
        .status(200)
        .json({ message: "Cập nhật trạng thái đơn hàng thành công" });
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm pútStatusOrder");
    res.status(500).json({ message: "Cập nhật trạng thái đơn hàng thất bại" });
  }
};
// Hàm tính tổng doanh thu theo ngày
exports.getDailyRevenue = async (req, res) => {
  try {
    const dailyRevenue = await orderEntity.aggregate([
      {
        // Nhóm dữ liệu theo ngày
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          // Tính tổng tiền của các đơn hàng đã lọc
          totalAmount: { $sum: "$totalAmount" },
          // Đếm số đơn hàng trong ngày đó
          orderCount: { $sum: 1 },
        },
      },
      {
        // Sắp xếp tăng dần theo ngày
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({ data: dailyRevenue });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy doanh thu", error: error.message });
  }
};
//Hàm lấy top khóa học bán chạy
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
    // Khóa học bán được nhiều nhất lên đầu
    { $sort: { totalSold: -1 } },
    //Lấy giới hạn 5 khóa học bán được nhiều nhất
    {
      $limit: 5,
    },
  ]);
  res.status(200).json({ data: bestSellerCourses });
};
