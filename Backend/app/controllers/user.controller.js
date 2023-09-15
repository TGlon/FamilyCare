const { User, Family, User_Family } = require("../models/index.model.js");
const createError = require("http-errors");


exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 11) {
    const { name, gender, birthday, address, passport, digital_identity, insurance, phone, email, nation, ethnic } = req.body;
    const users = await User.findAll();
    for (let value of users) {
      if (
        value.name == name &&
        value.gender == gender &&
        value.birthday == birthday &&
        value.address == address &&
        value.passport == passport &&
        value.digital_identity == digital_identity &&
        value.insurance == insurance &&
        value.phone == phone &&
        value.email == email &&
        value.nation == nation &&
        value.ethnic == ethnic
      ) {
        return res.send({
          error: true,
          msg: `Đã tồn tại người dùng ${value.name}.`,
        });
      }
    }
    try {
      const document = await User.create({
        name: req.body.name,
        gender: req.body.gender,
        birthday: req.body.birthday,
        address: req.body.address,
        passport: req.body.passport,
        digital_identity: req.body.digital_identity,
        insurance: req.body.insurance,
        phone: req.body.phone,
        email: req.body.email,
        nation: req.body.nation,
        ethnic: req.body.ethnic,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công người dùng ${document.name}`,
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
    const documents = await User.findAll({

    });
    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all users!"));
  }
};

// exports.findAllByFamily = async (req, res, next) => {
//   try {
//     const { FamilyId } = req.params; 

//     // Sử dụng phương thức findAll cùng với phương thức include để thực hiện JOIN
//     const usersInFamily = await User.findAll({
//       include: [
//         {
//           model: User_Family,
//           where: { FamilyId }, // Lọc theo FamilyId
//           attributes: ["relationship"], // Chọn thuộc tính cần lấy (relationship)
//         },
//       ],
//     });

//     return res.send(usersInFamily);
//   } catch (error) {
//     console.log(error);
//     return next(createError(400, "Error finding users in the family!"));
//   }
// };

exports.findOne = async (req, res, next) => {
  try {
    const documents = await User.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding user !"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await User.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "User not found"));
    }
    return res.send({
      msg: `Đã xoá thành công người dùng ${user.name}`,
      document: user,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting user"));
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
  const { name, gender, birthday, address, passport, digital_identity, insurance, phone, email, nation, ethnic } = req.body;
  // Kiểm tra xem dữ liệu cần thiết có bị thiếu không
  // if (!user_name || !password || !roleId || !EmployeeId) {
  //   return res.send({
  //     error: true,
  //     msg: "Vui lòng điền đầy đủ thông tin.",
  //   });
  // }
  try {
    let users = [
      await User.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    users = users.filter((value, index) => {
      return (
        value.name == name &&
        value.gender == gender &&
        value.birthday == birthday &&
        value.address == address &&
        value.passport == passport &&
        value.digital_identity == digital_identity &&
        value.insurance == insurance &&
        value.phone == phone &&
        value.email == email &&
        value.nation == nation &&
        value.ethnic == ethnic 
      );
    });

    if (users.length == 0) {
      const document = await User.update(
        {
          name: req.body.name,
          gender: req.body.gender,
          birthday: req.body.birthday,
          address: req.body.address,
          passport: req.body.passport,
          digital_identity: req.body.digital_identity,
          insurance: req.body.insurance,
          phone: req.body.phone,
          email: req.body.email,
          nation: req.body.nation,
          ethnic: req.body.ethnic
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
    return next(createError(400, "Error update"));
  }
};