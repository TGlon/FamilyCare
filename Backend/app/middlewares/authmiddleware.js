const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Lấy token từ tiêu đề Authorization
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Token không hợp lệ' });
  }

  jwt.verify(token, 'mysecretkey', (err, user) => {
    if (err) {
      return res.status(403).json({ msg: 'Xác thực không thành công' });
    }
    req.user = user; // Lưu thông tin người dùng từ token vào req.user
    next();
  });
}

module.exports = authenticateToken;
