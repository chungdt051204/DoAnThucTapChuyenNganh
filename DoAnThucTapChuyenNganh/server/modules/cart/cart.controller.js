const orderEntity = require("../../models/order.model");
const orderItemEntity = require("../../models/orderItem.model");
exports.addCart = async (req, res) => {
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
