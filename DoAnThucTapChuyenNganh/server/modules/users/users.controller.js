const userEntity = require("../../models/users.model");
const sessions = {};
exports.postLogin = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const user = await userEntity.findOne({
      email: body.email,
      password: body.password,
    });
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
        .json({ message: "Đăng nhập thành công" });
    }
  } catch (error) {
    console.log("Có lỗi xảy ra trong quá trình đăng nhập", error);
    res.status(500).json({ message: "Đăng nhập thất bại" });
  }
};
exports.getUser = async (req, res) => {
  try {
    const session = sessions[req.cookies.sessionId];
    if (!session) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    const user = await userEntity.findOne({ _id: session.id });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    } else return res.status(200).json(user);
  } catch (error) {
    console.log("Có lỗi xảy ra khi lấy thông tin người dùng", error);
    res.status(500).json({ message: "Lấy thông tin người dùng thất bại" });
  }
};
exports.logout = (req, res) => {
  delete sessions[req.cookies.sessionId];
  res
    .header("Set-Cookie", `sessionId=; Max-Age =0; httpOnly`)
    .status(200)
    .json({ message: "Đăng xuất thành công" });
};
exports.getInstructors = async (req, res) => {
  try {
    const instructors = await userEntity.find({ role: "instructor" });
    res.status(200).json(instructors);
  } catch (error) {
    console.log("Có lỗi xảy ra khi lấy thông tin giảng viên", error);
    res.status(500).json({ mesage: "Lấy thông tin giảng viên thất bại" });
  }
};
