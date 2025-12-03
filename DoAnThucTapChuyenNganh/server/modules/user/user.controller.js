const userEntity = require("../../models/user.model");
const sessions = {};
//Router xử lý chức năng đăng nhập
exports.postLogin = async (req, res) => {
  try {
    //Lấy dữ liệu gửi từ phía client thông qua req.body
    const { body } = req;
    console.log(body);
    const user = await userEntity.findOne({
      email: body.email,
      password: body.password,
    });
    //Nếu thông tin người dùng nhập không hợp lệ
    if (!user) {
      return res
        .status(401)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
    } else {
      //Nếu đúng thông tin đăng nhập thì tạo cookie
      const sessionId = Date.now().toString(); //Cookie luôn là String
      sessions[sessionId] = {
        id: user._id,
      };
      return res
        .cookie("sessionId", sessionId, {
          maxAge: 3000 * 1000,
          httpOnly: true,
        })
        .status(200)
        .json({ message: "Đăng nhập thành công", user });
    }
  } catch (error) {
    console.log("Có lỗi xảy ra trong quá trình đăng nhập", error);
    res.status(500).json({ message: "Đăng nhập thất bại" });
  }
};
//Router lấy thông tin user sau khi đã đăng nhập
exports.getUser = async (req, res) => {
  try {
    const session = sessions[req.cookies.sessionId];
    //Nếu không tồn tại session => Người dùng chưa đăng nhập
    if (!session) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    const user = await userEntity.findOne({ _id: session.id });
    //Nếu không tìm thấy user => Người dùng không tồn tại
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    } else return res.status(200).json(user);
  } catch (error) {
    console.log("Có lỗi xảy ra khi lấy thông tin người dùng", error);
    res.status(500).json({ message: "Lấy thông tin người dùng thất bại" });
  }
};
//Router xử lý chức năng đăng xuất
exports.logout = (req, res) => {
  //Xóa cookies => Mất phiên đăng nhập
  delete sessions[req.cookies.sessionId];
  res
    .header("Set-Cookie", `sessionId=; Max-Age =0; httpOnly`)
    .status(200)
    .json({ message: "Đăng xuất thành công" });
};

//Router xử lý cập nhật thông tin người dùng (tên, mật khẩu, avatar)
exports.updateUser = async (req, res) => {
  try {
    const session = sessions[req.cookies.sessionId];
    if (!session) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    const userId = session.id;
    const { fullName, password } = req.body;
    const updateObj = {};
    if (fullName) updateObj.fullName = fullName;
    if (password) updateObj.password = password;
    if (req.file && req.file.filename) updateObj.avatar = req.file.filename;

    // Nếu không có gì để cập nhật
    if (Object.keys(updateObj).length === 0) {
      const user = await userEntity.findOne({ _id: userId });
      return res.status(200).json({ message: "Không có thay đổi", user });
    }

    await userEntity.updateOne({ _id: userId }, { $set: updateObj });
    const updatedUser = await userEntity.findOne({ _id: userId });
    return res
      .status(200)
      .json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
    console.log("Có lỗi xảy ra khi cập nhật người dùng", error);
    res.status(500).json({ message: "Cập nhật người dùng thất bại" });
  }
};
