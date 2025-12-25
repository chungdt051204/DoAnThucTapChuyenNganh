const cartEntity = require("../../models/cart.model");
const orderEntity = require("../../models/order.model");
const enrollmentEntity = require("../../models/enrollment.model");
//Hàm xử lý tạo đơn hàng
exports.postOrder = async (req, res) => {
  try {
    const { body } = req;
    const courseItem = body.orderItemSelected.map((value) => {
      return {
        courseId: value.courseId._id,
        courseName: value.courseId.title,
        coursePrice: value.courseId.price,
      };
    });
    //Tạo đơn hàng
    await orderEntity.create({
      userId: body.userId,
      fullName: body.fullName,
      phone: body.phone,
      items: courseItem,
      totalAmount: body.totalAmount,
    });
    const orderItemId = body.orderItemSelected.map((value) => {
      return value._id;
    });
    //Xoa các khóa học đã mua khỏi giỏ hàng
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
        // Chờ tất cả các bản ghi enrollment được tạo xong
        await Promise.all(enrollmentPromises);
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
//Hàm lấy tổng doanh thu theo ngày
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
