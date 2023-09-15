const { Account } = require('../models/index.model');
const crypto = require('crypto');

const encryptionKey = "11032002200220011103200220022001";
const iv = "b2009872b1913315";

const setEncrypt = (value) => {
  if (value.length === 0) {
    return '';
  } else {
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Mã hóa thông tin đăng nhập
    const encryptedUserName = setEncrypt(username);
    const encryptedPassword = setEncrypt(password);

    // Kiểm tra thông tin đăng nhập
    const account = await Account.findOne({
      where: {
        username: encryptedUserName,
        password: encryptedPassword
      }
    });


    if (account) {
      // Đăng nhập thành công
      const token = account._id
      res.json({ success: true, message: 'Login successful', token});
    } else {
      // Sai tên người dùng hoặc mật khẩu
      res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
