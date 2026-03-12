require("dotenv").config();
const passport = require("passport");
const crypto = require("crypto");
const JWT_SECRET = process.env.JWT_SECRET;
const userEntity = require("../../models/user.model");
const orderEntity = require("../../models/order.model");
const enrollmentEntity = require("../../models/enrollment.model");
const { base64Url } = require("../../helper");

const sessions = {}; //Tạo mảng sessions rỗng
//Hàm chuyển hướng đến trang đăng nhập google
exports.getLoginGoogle = passport.authenticate("google", {
  scope: ["profile", "email"], //Lấy giá trị profile và email
  prompt: "select_account", //Mỗi lần chuyển đến trang đăng nhập google, người dùng có thể chọn tài khoản khác
});
//Hàm xử lý chức năng đăng ký
exports.postRegister = async (req, res) => {
  try {
    const { body } = req;
    //Kiểm tra trùng email
    const existingUser = await userEntity.findOne({
      email: body.email,
      loginMethod: "Email thường",
    });
    //Nếu người dùng đã tồn tại thì báo lỗi
    if (existingUser)
      return res.status(400).json({ message: "Email này đã tồn tại" });
    //Nếu chưa có thì thêm mới
    await userEntity.create({ ...body, avatar: req.file && req.file.path });
    return res.status(200).json({ message: "Đăng ký tài khoản thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postRegister");
    res
      .status(500)
      .json({ message: "Đăng ký tài khoản thất bại", error: error.message });
  }
};
//Hàm xử lý kết quả đăng nhập google
exports.getResultLoginGoogle = [
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const user = req.user;
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    const payload = {
      sub: user._id,
      exp: Date.now() + 3600000,
    };
    const encodedHeader = base64Url(JSON.stringify(header));
    const encodedPayload = base64Url(JSON.stringify(payload));
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = crypto.createHmac("sha256", JWT_SECRET);
    const signature = hmac.digest("base64url", tokenData);
    return res.redirect(
      `http://localhost:5173?token=${tokenData}.${signature}`
    );
  },
];
//Hàm xử lý chức năng đăng nhập
exports.postLogin = async (req, res) => {
  try {
    const { input, password } = req.body;
    // Tìm kiếm trong database người dùng khớp với cả email và password
    const user = await userEntity.findOne({
      $or: [{ username: input }, { email: input }],
      password: password,
    });
    // Nếu không tìm thấy người dùng
    if (!user) {
      // Trả về lỗi 401 (Unauthorized) và thông báo
      return res
        .status(401)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
    } else {
      const header = {
        alg: "HS256",
        typ: "JWT",
      };
      const payload = {
        sub: user._id,
        exp: Date.now() + 3600000,
      };
      //Mã hóa header
      const encodedHeader = base64Url(JSON.stringify(header));
      //Mã hóa payload
      const encodedPayload = base64Url(JSON.stringify(payload));
      //Tạo token data với header và payload đã mã hóa
      const tokenData = `${encodedHeader}.${encodedPayload}`;
      //Tạo signature
      const hmac = crypto.createHmac("sha256", JWT_SECRET);
      const signature = hmac.digest("base64url", tokenData);
      return res.status(200).json({
        message: "Đăng nhập thành công",
        token: `${tokenData}.${signature}`,
        result: user,
      });
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postLogin");
    res
      .status(500)
      .json({ message: "Đăng nhập thất bại", error: error.message });
  }
};
//Hàm lấy thông tin user sau khi đã đăng nhập
exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization.slice(7);
    if (!token) return res.status(401).json({ message: Unauthorized });
    const [encodedHeader, encodedPayload, tokenSignature] = token.split(".");
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = crypto.createHmac("sha256", JWT_SECRET);
    const signature = hmac.digest("base64url", tokenData);
    if (tokenSignature === signature) {
      const payload = JSON.parse(atob(encodedPayload));
      if (payload.exp < Date.now())
        return res.status(401).json({ message: "Token đã hết hạn" });
      const user = await userEntity.findOne({ _id: payload.sub });
      if (!user)
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      return res.status(200).json({ result: user });
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi lấy thông tin người dùng", {
      error: error.message,
    });
    res.status(500).json({
      message: "Lấy thông tin người dùng thất bại",
      error: error.message,
    });
  }
};
//Hàm lấy thông tin tất cả user trong database
exports.getUser = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) {
      query.role = role;
    }
    const users = await userEntity.find(query);
    res.status(200).json({ data: users });
  } catch (error) {
    console.log("Có lỗi xảy ra khi gọi hàm getUser");
    res.status(500).json({
      message: "Lấy danh sách người dùng thất bại",
      error: error.message,
    });
  }
};
//Hàm xử lý chức năng cập nhật trạng thái người dùng
exports.putStatusUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Thực hiện lệnh Cập nhật: Tìm người dùng theo ID và thiết lập trường status mới
    await userEntity.updateOne({ _id: id }, { status: status });
    res.status(200).json({
      message: "Thay đổi trạng thái người dùng có id" + id + "thành công",
    });
  } catch (error) {
    console.log("Có lỗi xảy ra khi thay đổi trạng thái người dùng");
    res.status(500).json({
      message: "Thay đổi trạng thái người dùng thất bại",
      error: error.message,
    });
  }
};
//Hàm xử lý cập nhật thông tin cá nhân của người dùng
exports.putUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { newFullname, newPassword } = req.body;
    // Tìm kiếm người dùng trong cơ sở dữ liệu bằng ID
    const userWithId = await userEntity.findOne({ _id: id });
    // Kiểm tra xem người dùng có tồn tại hay không
    if (!userWithId) {
      // Nếu không tìm thấy, trả về status 404 (Not Found)
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    } else {
      //Nếu tìm thấy, thực hiện cập nhật thông tin
      const result = await userEntity.updateOne(
        {
          _id: id,
        },
        {
          // Trường cập nhật username: Nếu newUserName rỗng, giữ lại username cũ
          fullName: newFullname === "" ? userWithId.fullName : newFullname,
          // Trường cập nhật password: Nếu newPassword rỗng, giữ lại password cũ
          password: newPassword === "" ? userWithId.password : newPassword,
          // Trường cập nhật avatar: Nếu có file mới dùng tên file đó ngược lại giữ lại avatar cũ
          avatar: req.file ? req.file.filename : userWithId.avatar,
        }
      );
      // Kiểm tra xem có bản ghi nào được thay đổi hay không
      if (result.modifiedCount === 0) {
        // Nếu không có bản ghi nào được cập nhật
        return res
          .status(404)
          .json({ message: "Không có dữ liệu nào được thêm mới" });
      } else {
        // Cập nhật thành công, trả về status 200
        return res
          .status(200)
          .json({ message: "Cập nhật thông tin người dùng thành công" });
      }
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi cập nhật thông tin người dùng");
    return res
      .status(500)
      .json({ message: "Cập nhật thông tin thất bại", error: error.message });
  }
};

//Hàm xử lý xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Tìm kiếm các đơn hàng có liên quan đến ID người dùng này
    const userWithOrders = await orderEntity.find({ userId: id });
    //Tìm kiếm các khóa học sở hữu bởi người dùng này
    const userInEnrollment = await enrollmentEntity.find({ userId: id });
    // Nếu người dùng có đơn hàng
    if (userWithOrders.length > 0) {
      // Trả về lỗi 409 Conflict (Xung đột) vì vi phạm tính toàn vẹn dữ liệu/nghiệp vụ
      return res
        .status(409)
        .json({ message: "Người dùng này đã có đơn hàng không thể xóa" });
    } else if (userInEnrollment.length > 0) {
      // Trả về lỗi 409 Conflict (Xung đột) vì vi phạm tính toàn vẹn dữ liệu/nghiệp vụ
      return res
        .status(409)
        .json({ message: "Người dùng này đang sở hữ khóa học, không thể xóa" });
    } else {
      // Xóa người dùng nếu không có đơn hàng và không sở hữu khóa học nào
      const result = await userEntity.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        // Nếu deletedCount = 0: Không tìm thấy người dùng để xóa
        return res
          .status(404)
          .json({ message: "Không tìm thấy người dùng để xóa" });
      } else {
        // Nếu deletedCount > 0: Xóa thành công
        return res.status(200).json({
          message: "Đã xóa tài khoản người dùng thành công",
        });
      }
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi xóa người dùng");
    res
      .status(500)
      .json({ message: "Xóa người dùng thất bại", error: error.message });
  }
};
