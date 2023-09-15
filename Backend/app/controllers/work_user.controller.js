const {Work_User} = require("../models/index.model.js");
const createError = require("http-errors");

exports.create = async (req, res, next) => {
    try {
        const document = await Work_User.create({
            ...req.body,
        });

        return res.status(200).json({
            msg: document ? "Tạo thành công" : "Tạo thất bại",
            error: document ? false : true,
        });
    } catch (error) {
        return next(createError(500, error.message));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Work_User.findAll({});

        return res.status(200).json({
            msg: documents.length > 0 ? "Danh sách công việc user!!" : "Trống",
            error: documents.length > 0 ? false : true,
            documents,
        });
    } catch (error) {
        return next(createError(500, error.message));
    }
};

exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const documents = await Work_User.findOne({
      where: {
        _id: id,
      },
    });

    return res.status(200).json({
      msg: documents ? "Find user work" : "Not found!!",
      statusCode: documents ? true : false,
      payload: documents ? documents : undefined,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.deleteOne = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await Work_User.destroy({
            where: {
                _id: id,
            },
        });

        return res.status(200).json({
            msg: document
                ? "Xóa thành công!!!"
                : "Không tìm thấy user để xóa!!!",
            error: document ? false : true,
        });
    } catch (error) {
        return next(createError(500, error.message));
    }
};

exports.update = async (req, res, next) => {
    const { id } = req.params;
    try {
        const document = await Work_User.update(
            {
                ...req.body,
            },
            {
                where: {
                    _id: id,
                },
            }
        );

        return res.status(200).json({
            msg: document[0]
                ? "Sửa dữ liệu thành công"
                : "Không tìm thấy thông tin để sửa",
            error: document[0] ? false : true,
        });
    } catch (error) {
        return next(createError(500, error.message));
    }
};