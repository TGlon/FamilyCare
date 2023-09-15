const { Vaccine_Types } = require("../models/index.model.js");
const createError = require("http-errors");

exports.create = async (req, res, next) => {
  try {
    const document = await Vaccine_Types.create({
      name: req.body.name,
    });
    return res.status(200).json({
      msg: document
        ? "Tạo loại vaccine thành công"
        : "Tạo loại vaccine thất bại",
      error: document ? false : true,
      document,
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, error.message));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Vaccine_Types.findAll();

    return res.status(200).json({
      msg:
        documents.length > 0
          ? "Danh sách loại vaccine"
          : "Danh sách không tồn tại",
      error: documents.length > 0 ? false : true,
      documents,
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, error.message));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Vaccine_Types.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.deleteOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const document = await Vaccine_Types.destroy({
      where: {
        _id: id,
      },
    });

    return res.status(200).json({
      msg: document ? "Xóa thành công" : "Không tìm thấy thông tin để sửa!!",
      error: document ? false : true,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.deleteAll = async (req, res, next) => {
    try {
      const deletedCount = await Vaccine_Types.destroy({
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
    const document = await Vaccine_Types.update(
      {
        name: req.body.name,
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