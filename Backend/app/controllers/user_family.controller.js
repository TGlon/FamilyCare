const { User, User_Family, Family } = require("../models/index.model.js");
const createError = require("http-errors");

exports.create = async (req, res, next) => {
  try {
    const { UserId, FamilyId, relationship } = req.body;

    // Kiểm tra xem UserId, FamilyId và relationship có giá trị hợp lệ
    if (!UserId || !FamilyId || !relationship) {
      return res.send({
        error: true,
        msg: `Vui lòng nhập đủ thông tin.`,
      });
    }

    // Kiểm tra sự tồn tại của quan hệ trong gia đình
    const existingRelationship = await User_Family.findOne({
      where: {
        UserId: UserId,
        FamilyId: FamilyId,
        relationship: relationship,
      },
    });

    if (existingRelationship) {
      return res.send({
        error: true,
        msg: `Đã tồn tại quan hệ ${existingRelationship.relationship} trong gia đình.`,
      });
    }

    // Tạo một bản ghi mới trong bảng User_Family
    const document = await User_Family.create({
      UserId: UserId,
      FamilyId: FamilyId,
      relationship: relationship,
    });

    return res.send({
      error: false,
      msg: `Bạn đã tạo thành công quan hệ ${document.relationship}`,
      document,
    });
  } catch (error) {
    console.error(error.message);
    return res.send({
      error: true,
      msg: error.message,
    });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await User_Family.findAll({
      include: [],
    });
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all relationship!"));
  }
};
exports.findAllByUserId = async (req, res, next) => {
  const { UserId } = req.params; // Đặt userId là một tham số trong URL hoặc request body
  try {
    const documents = await User_Family.findAll({
      where: { UserId: UserId }, // Lọc theo UserId
    });
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding family by UserId!"));
  }
};
exports.findAllByFamilyId = async (req, res, next) => {
  const { FamilyId } = req.params; // Đặt userId là một tham số trong URL hoặc request body
  try {
    const documents = await User_Family.findAll({
      where: { FamilyId: FamilyId }, // Lọc theo UserId
    });
    return res.send(
      documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding user by familyId!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await User_Family.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding relationship !"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const result = await User_Family.destroy({
      where: {
        UserId: req.body.UserId,
        FamilyId: req.body.FamilyId,
        relationship: req.body.relationship
      },
    });

    if (result === 0) {
      // If no records were deleted, return an error
      return next(createError(404, "UserFamily not found"));
    }
    return res.send({
      document: result,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting UserFamily"));
  }
};
// exports.findAllByIdUser = async (req, res, next) => {
//   try {
//     const { UserId } = req.params; // Lấy UserId từ URL hoặc req.body tùy theo cách bạn đã thiết lập route

//     if (!UserId) {
//       return res.status(400).send({
//         error: true,
//         msg: 'Vui lòng cung cấp UserId.',
//       });
//     }

//     // Tìm tất cả các bản ghi trong User_Family có UserId tương ứng
//     const userFamilyRecords = await User_Family.findAll({
//       where: {
//         UserId: UserId,
//       },
//     });

//     // Trích xuất danh sách các FamilyId từ các bản ghi tìm được
//     const familyIds = userFamilyRecords.map(record => record.FamilyId);

//     // Trả về danh sách FamilyId
//     return res.send({
//       error: false,
//       FamilyIds: familyIds,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).send({
//       error: true,
//       msg: 'Lỗi khi tìm FamilyIds.',
//     });
//   }
// };
