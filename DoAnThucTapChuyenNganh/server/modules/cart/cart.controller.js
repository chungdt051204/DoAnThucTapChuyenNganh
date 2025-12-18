const cartEntity = require("../../models/cart.model"); //Import cartEntity từ thư mục models
//Router xử lý chức năng thêm khóa học và giỏ hàng
exports.postCart = async (req, res) => {
  try {
    //Lấy dữ liệu gửi từ phía client bằng req.body
    const { body } = req;
    //Kiểm tra xem người dùng đã có giỏ hàng chưa
    const cartInDatabase = await cartEntity.findOne({
      userId: body.userId,
    });
    //Nếu chưa có thì tạo giỏ hàng và thêm khóa học được chọn vào giỏ hàng
    if (!cartInDatabase) {
      //Tạo giỏ hàng và khóa học đầu tiên vào
      await cartEntity.create({
        userId: body.userId,
        items: [
          {
            courseId: body.courseId,
          },
        ],
      });
      res.status(200).json("Đã thêm khóa học vào giỏ hàng thành công");
    }
    //Ngược lại nếu người dùng đã có giỏ hàng
    else {
      //Lấy dữ liệu cartId từ giỏ hàng hiện tại của người dùng trong database
      //Kiểm tra xem khóa học này đã nằm trong giỏ hàng chưa
      const courseInCart = await cartEntity.findOne({
        _id: cartInDatabase._id,
        "items.courseId": body.courseId, //Tìm xem có bất kỳ phần tử nào trong mảng có courseId này không
      });
      //Nếu người dùng chưa có khóa học này trong giỏ hàng thì thêm khóa học này vào giỏ hàng hiện tại
      if (!courseInCart) {
        await cartEntity.updateOne(
          { _id: cartInDatabase._id },
          {
            $push: {
              items: {
                courseId: body.courseId,
              },
            }, //Dùng push để thêm 1 khóa học sau các khóa học trong giỏ hàng($push chỉ dùng Object không dùng mảng)
          }
        );
        res.status(200).json("Đã thêm khóa học vào giỏ hàng thành công");
      }
      //Nếu có khóa học trong giỏ hàng rồi thì không được thêm nữa
      else {
        res
          .status(409)
          .json({ message: "Khóa học này đã tồn tại trong giỏ hàng" });
      }
    }
  } catch (error) {
    console.error("Có lỗi xảy ra khi xử lý hàm postCart");
    return res.status(500).json({ message: "Xử lý thêm vào giỏ thất bại" });
  }
};
//Router lấy dữ liệu khóa học nằm trong giỏ hàng
exports.getCartItem = async (req, res) => {
  //Lấy id người dùng gửi từ phía client bằng req.query
  const { user_id } = req.query;
  //Tìm kiếm giỏ hàng có userId bằng id người dùng gửi từ phía client
  const cart = await cartEntity
    .findOne({ userId: user_id })
    .populate("items.courseId");
  res.status(200).json(cart);
};
//Router xử lý chức năng xóa nhiều khóa học trong giỏ hàng
exports.deleteCartItems = async (req, res) => {
  //Lấy id người dùng gửi từ phía client bằng req.query
  const { user_id } = req.query;
  //Lấy mảng chứa id khóa học gửi từ phía client bằng req.body
  const { cartItemSelected } = req.body;
  //Xóa các item được chọn trong giỏ hàng bằng cách cập nhật lại item trong giỏ hàng
  //Dùng $push để xóa các item và $in lấy ra các item được chọn để xóa
  await cartEntity.updateOne(
    { userId: user_id },
    { $pull: { items: { _id: { $in: cartItemSelected } } } }
  );
  res.status(200).json({
    message:
      "Đã xóa" +
      " " +
      cartItemSelected.length +
      " " +
      "khóa học ra khỏi giỏ hàng thành công",
  });
};
