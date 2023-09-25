const { Account, Role, User } = require("../models/index.model.js");
const createError = require("http-errors");
const jwt = require('jsonwebtoken');

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 4) {
    const { UserId, password, username, roleId } = req.body;
    const accounts = await Account.findAll();
    for (let value of accounts) {
      if (
        value.username == username &&
        value.password == password &&
        value.UserId == UserId &&
        value.roleId == roleId
      ) {
        return res.send({
          error: true,
          msg: `Đã tồn tại tài khoản ${value.username}.`,
        });
      }
    }
    try {
      const document = await Account.create({
        username: req.body.username,
        password: req.body.password,
        UserId: req.body.UserId,
        roleId: req.body.roleId
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công tài khoản ${document.username}`,
        document,
      });
    } catch (error) {
      console.log(error.message);
      return res.send({
        error: true,
        msg: error.message,
      });
    }
  } else {
    return res.send({
      error: true,
      msg: `Vui lòng nhập đủ thông tin.`,
    });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Account.findAll({});
    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all accounts!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Account.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding account !"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await Account.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "Account not found"));
    }
    return res.send({
      msg: `Đã xoá thành công tài khoản ${account.username}`,
      document: account,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting account"));
  }
};

// exports.deleteAll = async (req, res, next) => {
//   // try {
//   //   const result = await Account.destroy({
//   //     where: {},
//   //     truncate: true, // Truncate the table to remove all records
//   //   });

//   //   if (result === 0) {
//   //     // If no records were deleted, return an error
//   //     // return next(createError(404, 'No accounts found'));
//   //     return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
//   //   }

//   //   //   return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
//   // } catch (error) {
//   //   console.log(error);
//   //   return next(createError(400, "Error deleting accounts"));
//   // }
// };

// // exports.update = async (req, res, next) => {
// //   console.log('update', req.body);
// //   try {
// //     const { user_name, password, roleId, EmployeeId } = req.body;
// //     const [updatedRowsCount, updatedRows] = await Account.update(
// //       {
// //         user_name,
// //         password,
// //         roleId,
// //         EmployeeId,
// //       },
// //       {
// //         where: {
// //           _id: req.params.id,
// //         },
// //         returning: true, // Get the updated rows as the result
// //       }
// //     );

// //     if (updatedRowsCount === 0) {
// //       // If no records were updated, return an error
// //       return next(createError(404, "Account not found"));
// //     }

// //     return res.send(updatedRows[0]); // Return the updated account
// //   } catch (error) {
// //     console.log(error);
// //     return next(createError(400, "Error updating account"));
// // //   }
// // };
exports.update = async (req, res, next) => {
  console.log("Update", req.body);
  const { UserId, password, username , roleId} = req.body;
  // Kiểm tra xem dữ liệu cần thiết có bị thiếu không
  // if (!user_name || !password || !roleId || !EmployeeId) {
  //   return res.send({
  //     error: true,
  //     msg: "Vui lòng điền đầy đủ thông tin.",
  //   });
  // }
  try {
    let accounts = [
      await Account.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    accounts = accounts.filter((value, index) => {
      return (
        value.username == username &&
        value.password == password &&
        value.UserId == UserId &&
        value.roleId == roleId
      );
    });

    if (accounts.length == 0) {
      const document = await Account.update(
        {
          UserId: req.body.UserId,
          password: req.body.password,
          username: req.body.username,
          roleId:req.body.roleId
        },
        { where: { _id: req.params.id }, returning: true }
      );
      return res.send({
        error: false,
        msg: "Dữ liệu đã được thay đổi thành công.",
      });
    } else {
      return res.send({
        error: true,
        msg: "Dữ liệu chưa được thay đổi.",
      });
    }
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error update"));
  }
};
exports.login = async (req, res, next) => {
  try {
      const secretKey = 'mysecretkey';
      const { username, password } = req.body;
      // Tìm người dùng trong danh sách người dùng
      let users = await Account.findAll({
          include: [
              Role,
              User
          ]
      })
      users = users.filter(
          (value, index) => {
              return value.username == username && value.password == password
          }
      )

      if (users.length == 0) {
          return res.send({
              msg: 'Tên tài khoản hoặc mật khẩu không hợp lệ!',
              error: true,
          })
      } else if (users.length > 0) {
          const token = jwt.sign({ userId: users[0].id }, secretKey);
          return res.send({
              error: false,
              token: token,
              document: users[0],
          })
      }
  } catch (error) {
      console.log(error);
  }
}

exports.findAccountByUserId = async (req, res, next) => {
  try {
    const { UserId } = req.params; // Lấy giá trị UserId từ tham số đường dẫn
    const accounts = await Account.findAll({
      where: {
        UserId: UserId,
      },
    });

    if (accounts.length === 0) {
      return res.send({
        error: true,
        msg: 'Không tìm thấy tài khoản nào cho UserId này.',
      });
    }

    return res.send({
      error: false,
      accounts: accounts,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, 'Lỗi khi tìm kiếm tài khoản theo UserId.'));
  }
};
