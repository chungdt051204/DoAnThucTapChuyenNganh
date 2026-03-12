exports.isLogin = (req, res, next) => {
  if (req.user) return next();
  else return res.status(401).json({ message: "Bạn chưa đăng nhập" });
};
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  else return res.status(403).json({ message: "Bạn không phải là admin" });
};
