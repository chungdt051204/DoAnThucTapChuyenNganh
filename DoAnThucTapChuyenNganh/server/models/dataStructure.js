// {
//     _id: ObjectId,          // Mã định danh duy nhất của người dùng
//     fullName: String,       // Họ và tên đầy đủ
//     username: String,       // Tên đăng nhập
//     email: String,          // Địa chỉ email
//     password: String,       // Mật khẩu
//     phone: String,          // Số điện thoại liên hệ
//     dateOfBirth: Date,      // Ngày sinh
//     gender: String,         // Giới tính ("Nam", "Nữ", "Khác")
//     avatar: String,         // Đường dẫn ảnh đại diện (URL)
//     role: String,           // Vai trò: "user" | "instructor" | "admin"
//     status: String,         // Trạng thái tài khoản: "active" | "inactive" | "banned"
//     createdAt: Date,        // Ngày tạo tài khoản
//     updatedAt: Date         // Ngày cập nhật gần nhất
//   }
//   {
//     _id: ObjectId,               // Mã định danh duy nhất của khóa học
//     title: String,               // Tên khóa học
//     description: String,         // Mô tả chi tiết về khóa học
//     categoryId: ObjectId,          // ID danh mục khóa học (tham chiếu đến collection categories)
//     instructorId: ObjectId,         // ID giảng viên đăng khóa học (tham chiếu đến collection users)
//     level: String,               // Cấp độ: "Cơ bản", "Trung cấp", "Nâng cao"
//     language: String,            // Ngôn ngữ giảng dạy (VD: "Tiếng Việt", "English")
//     duration: String,            // Thời lượng toàn khóa (VD: "10 giờ 30 phút")
//     price: Number,               // Giá khóa học
//     rating: Number,              // Điểm đánh giá trung bình (VD: 4.5)
//     totalLessons: Number,        // Tổng số bài học trong khóa
//     thumbnail: String,           // Ảnh nền khóa học (URL)
//     image: String                // Ảnh đại diện khóa học (URL)
//     tags: [String],              // Các từ khóa gắn với khóa học
//     objectives: [String],        // Mục tiêu học tập (VD: “Nắm vững cú pháp JavaScript”)
//     requirements: [String],      // Yêu cầu đầu vào (VD: “Biết HTML cơ bản”)
//     lessons: [                   // Danh sách bài học (mảng object)
//       {
//         title: String,           // Tên bài học
//         duration: String,        // Thời lượng bài học
//         order: Number,           // Thứ tự bài trong khóa
//         videoUrl: String,        // Link video bài học

//       }
//     ],
//     isFeatured: Boolean,         // Có được đánh dấu là khóa học nổi bật hay không
//     isFree: Boolean,          // Khoá học miễn phí hay không
//     status: String            //Trạng thái của khóa học
//     createdAt: Date,             // Ngày tạo khóa học
//     updatedAt: Date              // Ngày cập nhật khóa học
//   }
//   {
//     _id: ObjectId,   // Mã định danh danh mục
//     title: String     // Tên danh mục (VD: "Lập trình Web", "Python", "C++")
//   }
//   {
//     _id: ObjectId,             // Mã định danh đơn hàng
//     userId: ObjectId,          // Tham chiếu đến người dùng mua khóa học
//     courseId: ObjectId,        // Tham chiếu đến khóa học được mua
//     amount: Number,            // Số tiền thanh toán
//     paymentMethod: String,     // Phương thức thanh toán (VD: "VNPay", "MoMo", "Paypal")
//     paymentStatus: String,     // Trạng thái thanh toán: "pending" | "success" | "failed"
//     createdAt: Date,           // Ngày tạo đơn hàng
//     updatedAt: Date            // Ngày cập nhật gần nhất
//   }
//   {
//     _id: ObjectId,        // Mã định danh của đánh giá
//     userId: ObjectId,     // Tham chiếu đến người dùng (collection users)
//     courseId: ObjectId,   // Tham chiếu đến khóa học (collection courses)
//     rating: Number,       // Điểm đánh giá (1–5 sao)
//     comment: String,      // Nội dung nhận xét
//     createdAt: Date,      // Ngày tạo đánh giá
//     updatedAt: Date       // Ngày cập nhật (nếu có)
//   }
