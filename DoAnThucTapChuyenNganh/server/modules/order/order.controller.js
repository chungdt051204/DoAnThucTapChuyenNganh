// Controller xử lý các thao tác liên quan đến đơn hàng (orders)
// Hàm chính xuất khẩu ở đây: getAllOrders
// getAllOrders trả về danh sách tất cả đơn hàng theo định dạng dễ tiêu thụ ở frontend

const orderEntity = require("../../models/order.model");
const userEntity = require("../../models/user.model");

/**
 * GET /orders
 * Lấy tất cả đơn hàng từ collection `order`
 * - populate thông tin người dùng (`userId`) để frontend có thể hiển thị tên/email
 * - sort theo `createdAt` giảm dần
 * - chuyển đổi các kiểu dữ liệu (ví dụ Decimal128) về dạng số để frontend dễ xử lý
 * - map ra cấu trúc gồm: _id, code, user, createdAt, total, status, raw
 */
const getAllOrders = async (req, res) => {
  try {
    // Lấy dữ liệu từ DB và populate trường `userId` (chỉ lấy `fullName` và `email`)
    // .lean() để nhận plain JS object (tối ưu khi chỉ đọc dữ liệu)
    const orders = await orderEntity
      .find()
      .populate({ path: "userId", select: "fullName email" })
      .sort({ createdAt: -1 })
      .lean();

    // Map dữ liệu DB về định dạng mà frontend (component) mong đợi
    const mapped = orders.map((o) => {
      // totalAmount trong schema được khai báo là Decimal128, nên khi trả về
      // cần chuyển về number JavaScript (parseFloat từ toString()) nếu có
      const totalRaw = o.totalAmount;
      let total = totalRaw;
      try {
        // Nếu totalRaw là Decimal128 hoặc có method toString(), chuyển về number
        if (totalRaw && totalRaw.toString) {
          total = parseFloat(totalRaw.toString());
        }
      } catch (e) {
        // Nếu không chuyển được, giữ nguyên giá trị để tránh crash
        total = totalRaw;
      }

      // Chuẩn hóa thông tin người mua để frontend dễ hiển thị:
      // - Nếu có `userId` (đã populate) thì lấy `fullName` và `email`
      // - Nếu không có nhưng có `purchaserName`/`purchaserEmail` (fallback), dùng giá trị đó
      // - Nếu không có thông tin nào, set null
      const userInfo = o.userId
        ? { name: o.userId.fullName, email: o.userId.email }
        : o.purchaserName || o.purchaserEmail
        ? { name: o.purchaserName || "", email: o.purchaserEmail || "" }
        : null;

      return {
        _id: o._id,
        // `code` dùng làm mã hiển thị (ở đây dùng _id nếu chưa có code riêng)
        code: o._id,
        user: userInfo,
        // createdAt sẽ ưu tiên `orderDate` nếu ghi riêng, nếu không dùng `createdAt` của document
        createdAt: o.orderDate || o.createdAt,
        total: total,
        // status giữ nguyên theo schema (ví dụ: 'cart', 'completed', 'cancelled')
        status: o.status,
        // raw: giữ nguyên object gốc nếu sau này cần debug hoặc hiển thị chi tiết
        raw: o,
      };
    });

    // Trả về mảng đã map cho client
    return res.status(200).json(mapped);
  } catch (error) {
    // Ghi log lỗi phía server và trả về mã 500 kèm thông báo
    console.error("Lỗi khi lấy đơn hàng", error);
    return res.status(500).json({ message: "Lấy đơn hàng thất bại", error });
  }
};

module.exports = {
  getAllOrders,
};
