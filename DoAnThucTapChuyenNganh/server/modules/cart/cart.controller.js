const orderEntity = require("../../models/order.model");
const orderItemEntity = require("../../models/orderItem.model");
//Router xử lý chức năng thêm khóa học và giỏ hàng
exports.addCart = async (req, res) => {
  //Lấy dữ liệu gửi từ phía client bằng req.body
  const { body } = req;
  //Kiểm tra xem người dùng có đơn hàng trạng thái cart chưa
  const orderInDatabase = await orderEntity.findOne({
    userId: body.userId,
    status: "cart",
  });
  //Nếu chưa có thì tạo đơn hàng trạng thái cart và thêm khóa học với chi tiết đơn hàng
  if (!orderInDatabase) {
    //Thêm đơn hàng
    const order = await orderEntity.create({
      userId: body.userId,
      totalAmount: body.coursePrice,
    });
    //Thêm khóa học vào chi tiết đơn hàng
    const currentOrderId = order._id; //Lấy orderId vừa mới thêm
    await orderItemEntity.create({
      orderId: currentOrderId,
      courseId: body.courseId,
      courseName: body.courseName,
      priceAtPurchase: body.coursePrice,
    });
    res
      .status(200)
      .json(
        "Thêm khóa học" +
          " " +
          body.courseName +
          " " +
          "vào giỏ hàng thành công"
      );
  }
  //Ngược lại nếu người dùng đã có đơn hàng trạng thái cart
  else {
    //Lấy dữ liệu orderId từ đơn hàng trạng thái cart hiện tại của người dùng trong database
    //Kiểm tra xem khóa học này đã nằm trong giỏ hàng chưa
    const courseInOrderItem = await orderItemEntity.findOne({
      orderId: orderInDatabase._id,
      courseId: body.courseId,
    });
    //Nếu người dùng chưa có khóa học này trong giỏ hàng thì thêm vào giỏ hàng và cập nhật lại totalAmount
    //cho đơn hàng
    if (!courseInOrderItem) {
      await orderItemEntity.create({
        orderId: orderInDatabase._id,
        courseId: body.courseId,
        courseName: body.courseName,
        priceAtPurchase: body.coursePrice,
      });
      //Tính tổng tiền tất cả khóa học trong đơn hàng
      let tong = 0;
      const orderItemsInOrder = await orderItemEntity.find({
        orderId: orderInDatabase._id,
      });
      //Duyệt vòng lặp
      orderItemsInOrder.forEach((value) => {
        tong = tong + parseFloat(value.priceAtPurchase);
        return tong;
      });
      //Cập nhật lại tổng tiền cho đơn hàng của người dùng
      await orderEntity.updateOne({
        userId: body.userId,
        totalAmount: tong.toString(),
      });
      res
        .status(200)
        .json(
          "Đã thêm khóa học" +
            " " +
            body.courseName +
            " " +
            "vào giỏ hàng thành công"
        );
    } else {
      res
        .status(500)
        .json({ message: "Khóa học này đã tồn tại trong giỏ hàng" });
    }
  }
};
//Router lấy dữ liệu khóa học nằm trong giỏ hàng
exports.getCartItem = async (req, res) => {
  //Lấy id người dùng gửi từ phía client bằng req.query
  const { user_id } = req.query;
  //Tìm kiếm đơn hàng có userId bằng id người dùng gửi từ phía client
  const order = await orderEntity.findOne({ userId: user_id });
  const orderItems = await orderItemEntity
    .find({ orderId: order._id })
    .populate("courseId"); //Sử dụng popullate để tham chiếu đến collection course và lấy toàn bộ thuộc tính
  if (!orderItems)
    return res.status(404).json({ message: "Giỏ hàng của bạn hiện đang rỗng" });
  else return res.status(200).json(orderItems);
};
//Router xử lý chức năng xóa nhiều khóa học trong giỏ hàng
exports.deleteCartItems = async (req, res) => {
  //Lấy mảng chứa id khóa học gửi từ phía client bằng req.body
  const { orderIdItemsSelected } = req.body;
  await orderItemEntity.deleteMany({ _id: { $in: orderIdItemsSelected } });
  //Dùng toán tử $in để cho phép xóa nhiều phần tử trong database có id thuộc mảng orderIdItemsSelected
  res.status(200).json({
    message:
      "Đã xóa" +
      " " +
      orderIdItemsSelected.length +
      " " +
      "khóa học ra khỏi giỏ hàng thành công",
  });
};
