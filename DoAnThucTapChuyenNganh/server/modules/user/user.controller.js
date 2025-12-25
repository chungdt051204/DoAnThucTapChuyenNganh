const passport = require("passport"); //Import thư viện passport để sử dụng
const userEntity = require("../../models/user.model"); //Import userEntity để sử dụng
const orderEntity = require("../../models/order.model");
const enrollmentEntity = require("../../models/enrollment.model"); //Import enrollmentEntity để sử dụng

const sessions = {}; //Tạo mảng sessions rỗng
//Hàm chuyển hướng đến trang đăng nhập google
exports.getLoginGoogle = passport.authenticate("google", {
  scope: ["profile", "email"], //Lấy giá trị profile và email
  prompt: "select_account", //Mỗi lần chuyển đến trang đăng nhập google, người dùng có thể chọn tài khoản khác
});
//Hàm xử lý chức năng đăng ký
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
    const sessionId = Date.now().toString();
    sessions[sessionId] = {
      id: user._id,
    };
    res
      .setHeader(
        "Set-Cookie",
        `sessionId=${sessionId}; max-age=3600; httpOnly; path=/`
      )
      .redirect("http://localhost:5173"); //Đăng nhập google thành công thì set cookie và chuyển hướng về trang chủ
  },
];
//Hàm xử lý chức năng đăng nhập
exports.postLogin = async (req, res) => {
  try {
    // Lấy dữ liệu email và password gửi từ client
    const { body } = req;
    // Xác thực người dùng
    // Tìm kiếm trong database người dùng khớp với cả email và password
    const user = await userEntity.findOne({
      email: body.email,
      password: body.password,
    });
    // Xử lý lỗi xác thực
    // Nếu không tìm thấy người dùng
    if (!user) {
      // Trả về lỗi 401 (Unauthorized) và thông báo
      return res
        .status(401)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
    } else {
      // Thiết lập Phiên (Session)
      // Nếu đăng nhập thành công
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
    console.log("Có lỗi xảy ra khi xử lý hàm postLogin");
    // Trả về lỗi 500 nếu có lỗi hệ thống.
    res
      .status(500)
      .json({ message: "Đăng nhập thất bại", error: error.message });
  }
};
//Hàm lấy thông tin user sau khi đã đăng nhập
exports.getMe = async (req, res) => {
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
    } else return res.status(200).json({ data: user });
  } catch (error) {
    console.log("Có lỗi xảy ra khi lấy thông tin người dùng");
    res.status(500).json({
      message: "Lấy thông tin người dùng thất bại",
      error: error.message,
    });
  }
};
//Hàm lấy thông tin user trong database
exports.getUser = async (req, res) => {
  try {
    //Lấy vai trò gửi từ phía client bằng req.query
    const { role } = req.query;
    //Tạo mảng query rỗng
    let query = {};
    //Nếu có vai trò
    if (role) {
      query.role = role; //Thêm role vào mảng query
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
    const { id } = req.params; // Lấy ID người dùng từ URL parameter
    const { status } = req.body; // Lấy trạng thái mới từ request body
    // Thực hiện lệnh Cập nhật: Tìm người dùng theo ID và thiết lập trường status mới
    await userEntity.updateOne({ _id: id }, { status: status });
    // Trả về thành công
    res.status(200).json({
      message: "Thay đổi trạng thái người dùng có id" + id + "thành công",
    });
  } catch (error) {
    // Xử lý Lỗi: Ghi log lỗi và trả về lỗi máy chủ
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
    // Lấy ID người dùng từ tham số URL
    const { id } = req.params;
    // Lấy thông tin cập nhật từ body của yêu cầu
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
          //Điều kiện tìm kiếm: ID người dùng
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
    // Bắt và ghi log bất kỳ lỗi nào xảy ra trong quá trình cập nhật
    console.log("Có lỗi xảy ra khi cập nhật thông tin người dùng");
    // Trả về status 500 nếu có lỗi xảy ra
    return res
      .status(500)
      .json({ message: "Cập nhật thông tin thất bại", error: error.message });
  }
};
//Hàm xử lý chức năng đăng xuất
exports.logout = (req, res) => {
  //Xóa cookies => Mất phiên đăng nhập
  delete sessions[req.cookies.sessionId];
  res
    .header("Set-Cookie", `sessionId=; Max-Age =0; httpOnly`)
    .status(200)
    .json({ message: "Đăng xuất thành công" });
};
//Hàm xử lý xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID người dùng từ URL parameter
    //  Kiểm tra Ràng buộc Nghiệp vụ
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
      //  Thực hiện Xóa
      // Xóa người dùng nếu không có đơn hàng và không sở hữu khóa học nào
      const result = await userEntity.deleteOne({ _id: id });
      //  Xử lý Kết quả Xóa
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
    // Xử lý Lỗi hệ thống
    console.log("Có lỗi xảy ra khi xóa người dùng");
    res
      .status(500)
      .json({ message: "Xóa người dùng thất bại", error: error.message });
  }
};
