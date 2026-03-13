const cartEntity = require("../../models/cart.model");
const orderEntity = require("../../models/order.model");
const enrollmentEntity = require("../../models/enrollment.model");
const revenueEntity = require("../../models/revenue.model");
const date = Date.now();
const dayJS = require("dayjs");
const start = dayJS().startOf("day").toDate();
const end = dayJS().endOf("day").toDate();
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
    //Tạo doanh thu của từng khóa học trong ngày
    const revenuePromises = orderItemSelected.map(async (value) => {
      const revenue = await revenueEntity.findOne({
        courseId: value.courseId,
        createdAt: { $gte: start, $lte: end },
      });
      if (!revenue) {
        return revenueEntity.create({
          courseId: value.courseId,
          courseName: value.courseName,
          totalAmount: value.appliedAmount,
        });
      } else {
        return revenueEntity.updateOne(
          {
            courseId: value.courseId,
            createdAt: { $gte: start, $lte: end },
          },
          { totalAmount: revenue.totalAmount + value.appliedAmount }
        );
      }
    });
    await Promise.all(revenuePromises);
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
    res
      .status(500)
      .json({ message: "Thanh toan that bai", error: error.message });
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
    res
      .status(500)
      .json({ message: "Lấy dữ liệu đơn hàng thất bại", error: error.message });
  }
};
//Hàm cập nhật thông tin đơn hàng
exports.putOrder = async (req, res) => {
  try {
    const { userId, orderId, orderItemId, courseId, remainingAmount } =
      req.body;
    const amountPaid = Number(remainingAmount);
    // Tìm đơn hàng hiện tại từ database
    const order = await orderEntity.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng này" });
    }
    const currentRemainingAmount = Number(order.remainingAmount);
    const currentTotalAmount = Number(order.totalAmount);
    // Tính toán thông số mới
    const newRemainingAmount = currentRemainingAmount - amountPaid;
    const newTotalAmount = currentTotalAmount + amountPaid;
    // Thực hiện cập nhật Đơn hàng
    await orderEntity.updateOne(
      { _id: orderId, "items._id": orderItemId },
      {
        $set: {
          //$set thay thế toàn bộ giá trị cũ thành giá trị mới
          "items.$.appliedAmount": order.items.id(orderItemId).coursePrice,
          "items.$.paymentType": "FULL",
          totalAmount: newTotalAmount,
          remainingAmount: newRemainingAmount,
          status:
            newRemainingAmount === 0 ? "Đã hoàn thành" : "Chưa hoàn thành",
        },
      }
    );
    // Mở khóa quyền truy cập
    await enrollmentEntity.updateOne(
      { userId: userId, courseId: courseId },
      { $set: { accessLevel: "UNLIMITED" } }
    );
    return res.status(200).json({
      message: "Thanh toán thành công! Bạn đã có quyền xem toàn bộ bài học.",
    });
  } catch (error) {
    console.error("Lỗi putOrder:", error);
    res.status(500).json({
      message: "Thanh toán thất bại, vui lòng thử lại sau",
      error: error.message,
    });
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
    console.log("Có lỗi xảy ra khi xử lý hàm getDailyRevenue");
    res
      .status(500)
      .json({ message: "Lỗi khi lấy doanh thu", error: error.message });
  }
};
//Hàm lấy top khóa học bán chạy
exports.getBestSellerCourses = async (req, res) => {
  try {
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
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getBestSellerCourses");
    res.status(500).json({
      message: "Lỗi khi lấy dữ liệu khóa học bán chạy",
      error: error.message,
    });
  }
};
