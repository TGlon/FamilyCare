const { SetTime, User } = require("../models/index.model.js");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../config/index");

exports.create = async (req, res, next) => {
  try {
    const { day, UserId } = req.body;

    if (!day || !UserId) {
      return res.send({
        error: true,
        msg: "Vui lòng nhập đủ thông tin.",
      });
    }

    const document = await SetTime.create({
      day,
      UserId,
    });

    return res.send({
      error: false,
      msg: `Bạn đã tạo thành công time ${document.day}`,
      document,
    });
  } catch (error) {
    console.log(error.message);
    return res.send({
      error: true,
      msg: error.message,
    });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await SetTime.findAll();

    return res.status(200).json({
      msg:
        documents.length > 0
          ? "Danh sách thời gian đã được tải thành công."
          : "Danh sách không tồn tại",
      error: documents.length > 0 ? false : true,
      documents,
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, error.message));
  }
};

exports.update = async (req, res, next) => {
  // console.log("Update", req.body);
  const { UserId, day } = req.body;
  try {
    let time = [
      await SetTime.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    time = time.filter((value, index) => {
      return (
        value.UserId == UserId &&
        value.day == day 
      );
    });

    if (time.length == 0) {
      const document = await SetTime.update(
        {
            
            day: req.body.day,
            UserId: req.body.UserId,
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