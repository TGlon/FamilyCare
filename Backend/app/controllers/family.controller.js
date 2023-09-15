const { Family, User_Family, User } = require("../models/index.model.js");
const createError = require("http-errors");

exports.create = async (req, res, next) => {
  try {
    const document = await Family.create({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone
    });
    return res.status(200).json({
      msg: document
        ? "Tạo hộ gia đình thành công"
        : "Tạo hộ gia đình thất bại",
      error: document ? false : true,
      document,
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, error.message));
  }
};

// exports.create = async (req, res, next) => {
//   try {
//     // Tạo gia đình mới
//     const family = await Family.create({
//       name: req.body.name,
//       address: req.body.address,
//       phone: req.body.phone
//     });

//     // Tạo liên kết giữa người dùng và gia đình
//     await User_Family.create({
//       userId: req.user.id, // Thay thế bằng cách lấy userId của bạn từ biến đăng nhập hoặc thông tin đăng nhập
//       familyId: family.id, // Lấy familyId từ bước trước
//       relationship: 'Chủ Hộ' // Mối quan hệ
//     });

//     return res.status(200).json({
//       msg: "Tạo hộ gia đình thành công",
//       error: false,
//       family,
//     });
//   } catch (error) {
//     console.log(error);
//     return next(createError(500, error.message));
//   }
// };
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Family.findAll();

    return res.status(200).json({
      msg:
        documents.length > 0
          ? "Danh sách các hộ gia đình"
          : "Danh sách không tồn tại",
      error: documents.length > 0 ? false : true,
      documents,
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, error.message));
  }
};
exports.findAllById = async(req,res, next) => {
  const { familyId } = req.params; 
  try {
    const documents = await Family.findAll({
      where: { _id: familyId }, 
    });
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding family by Id!"));
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Family.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(500, error.message));
  }
};

// exports.deleteOne = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const document = await Family.destroy({
//       where: {
//         _id: id,
//       },
//     });

//     return res.status(200).json({
//       msg: document ? "Xóa thành công" : "Không tìm thấy thông tin để sửa!!",
//       error: document ? false : true,
//     });
//   } catch (error) {
//     return next(createError(500, error.message));
//   }
// };
exports.deleteOne = async (req, res, next) => {
  try {
    const fam = await Family.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await Family.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "family not found"));
    }
    return res.send({
      msg: `Đã xoá thành công hộ gia đình`,
      document: fam,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting family!"));
  }
};

exports.deleteAll = async (req, res, next) => {
    try {
      const deletedCount = await Family.destroy({
        where: {},
        truncate: true, // Truncate table to remove all data
      });
  
      return res.status(200).json({
        msg: deletedCount > 0 ? "Xóa tất cả thành công" : "Không có thông tin để xóa!!",
        error: deletedCount > 0 ? false : true,
      });
    } catch (error) {
      return next(createError(500, error.message));
    }
  };
  

exports.update = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const document = await Family.update(
      {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
      },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    console.log(document);
    return res.status(200).json({
      msg: document[0]
        ? "Sửa dữ liệu thành công"
        : "Không tìm thấy dữ liệu để sửa!!",
      statusCode: document[0] ? true : false,
      payload: document[0] ? document : undefined,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

