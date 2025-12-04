const userEntity = require("../../models/user.model"); //Import userEntity để sử dụng
const sessions = {}; //Tạo mảng sessions rỗng
exports.postRegister = async (req, res) => {
  try {
    const { body } = req; //req.body lấy dữ liệu gửi từ phía client
    //Kiểm tra trùng email
    const existingUser = await userEntity.findOne({ email: body.email });
    //Nếu người dùng đã tồn tại thì báo lỗi
    if (existingUser)
      return res.status(400).json({ message: "Email này đã tồn tại" });
    //Nếu chưa có thì thêm mới
    await userEntity.create({ ...body, avatar: req.file && req.file.filename });
    return res.status(200).json({ message: "Đăng ký tài khoản thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postRegister", error);
    res.status(500).json({ message: "Đăng ký tài khoản thất bại" });
  }
};
//Router xử lý chức năng đăng nhập
// Hàm xử lý logic đăng nhập người dùng (POST /login).
exports.postLogin = async (req, res) => {
  try {
    // Lấy dữ liệu email và password gửi từ client
    const { body } = req;

    // Xác thực Người dùng
    // Tìm kiếm trong database người dùng khớp với cả email và password
    const user = await userEntity.findOne({
      email: body.email,
      password: body.password,
    });

    // Xử lý Lỗi Xác thực
    // Nếu không tìm thấy người dùng
    if (!user) {
      // Trả về lỗi 401 (Unauthorized) và thông báo
      return res
        .status(401)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
    } else {
      // Thiết lập Phiên (Session)
      // Nếu đăng nhập thành công:
      const sessionId = Date.now().toString(); // Tạo ID phiên duy nhất (luôn là chuỗi)
      sessions[sessionId] = {
        id: user._id, // Lưu ID người dùng vào phiên trên server
      };

      // Tạo và Gửi Cookie
      return (
        res
          .cookie("sessionId", sessionId, {
            // Thiết lập cookie "sessionId" cho client
            maxAge: 3000 * 1000, // Thời gian sống của cookie
            httpOnly: true, // Chỉ cho phép HTTP truy cập tăng bảo mật
          })
          // Trả về mã 200 (OK), thông báo và thông tin người dùng
          .status(200)
          .json({ message: "Đăng nhập thành công", user })
      );
    }
  } catch (error) {
    // Xử lý Lỗi Server
    console.log("Có lỗi xảy ra khi xử lý hàm postLogin", error);
    // Trả về lỗi 500 nếu có lỗi hệ thống.
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
      //Ngược lại thì gửi thôn tin của user cho phía client
    } else return res.status(200).json(user);
  } catch (error) {
    console.log("Có lỗi xảy ra khi lấy thông tin người dùng", error);
    res.status(500).json({ message: "Lấy thông tin người dùng thất bại" });
  }
};
//Router lấy dữ liệu tất cả người dùng trong database
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userEntity.find();
    res.status(200).json(users);
  } catch (error) {
    console.log("Có lỗi xảy ra khi lấy dữ liệu tất cả người dùng", error);
    res
      .status(500)
      .json({ message: "Lấy thông tin tất cả người dùng thất bại" });
  }
};
//Router lấy dữ liệu người dùng dựa vào vai trò
exports.getUsersWithRole = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await userEntity.find({ role: role });
    res.status(200).json(users);
  } catch (error) {
    console.log(
      "Có lỗi xảy ra khi lấy dữ liệu người dùng dựa vào vai trò",
      error
    );
    res
      .status(500)
      .json({ message: "Lấy thông tin người dùng dựa vào vai trò thất bại" });
  }
};
exports.putStatusUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await userEntity.updateOne({ _id: id }, { status: status });
    res.status(200).json({
      message: "Thay đổi trạng thái người dùng có id" + id + "thành công",
    });
  } catch (error) {
    console.log("Có lỗi xảy ra khi thay đổi trạng thái người dùng", error);
    res
      .status(500)
      .json({ message: "Thay đổi trạng thái người dùng thất bại" });
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
