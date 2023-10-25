const { Health_Statistics, User } = require("../models/index.model.js");
const createError = require("http-errors");


exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 7) {
    const { UserId, recording_date, weight, height, blood_type, heart_rate, blood_pressure } = req.body;
    const users = await Health_Statistics.findAll();
    for (let value of users) {
      if (
        value.UserId == UserId &&
        value.recording_date == recording_date &&
        value.weight == weight &&
        value.height == height &&
        value.blood_type == blood_type &&
        value.heart_rate == heart_rate &&
        value.blood_pressure == blood_pressure 
      ) {
        return res.send({
          error: true,
          msg: `Đã tồn tại hồ sơ sức khỏe được ghi ngày ${value.recording_date}.`,
        });
      }
    }
    try {
      const document = await Health_Statistics.create({
        recording_date: req.body.recording_date,
        weight: req.body.weight,
        height: req.body.height,
        blood_type: req.body.blood_type,
        heart_rate: req.body.heart_rate,
        blood_pressure: req.body.blood_pressure,
        UserId: req.body.UserId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công hồ sơ sức khỏe ngày ${document.recording_date}`,
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
    const documents = await Health_Statistics.findAll({
      include: [{
        model: User,
      }]
    });
    return res.send( documents.sort((a, b) => new Date(b.recording_date) - new Date(a.recording_date)));
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all health statstics!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Health_Statistics.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding health statstics!"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const health = await Health_Statistics.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await Health_Statistics.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "health statstics not found"));
    }
    return res.send({
      msg: `Đã xoá thành công hồ sơ sức khỏe ngày ${health.recording_date}`,
      document: health,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting health statstics!"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const result = await Health_Statistics.destroy({
      where: {},
      truncate: true, // Truncate the table to remove all records
    });

    if (result === 0) {
      return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
    }
    //   return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting health statistics"));
  }
};

exports.update = async (req, res, next) => {
  console.log("Update", req.body);
  const { UserId, recording_date, weight, height, blood_type, heart_rate, blood_pressure } = req.body;
  try {
    let healths = [
      await Health_Statistics.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    healths = healths.filter((value, index) => {
      return (
        value.UserId == UserId &&
        value.recording_date == recording_date &&
        value.weight == weight &&
        value.height == height &&
        value.blood_type == blood_type &&
        value.heart_rate == heart_rate &&
        value.blood_pressure == blood_pressure 
      );
    });

    if (healths.length == 0) {
      const document = await Health_Statistics.update(
        {
            recording_date: req.body.recording_date,
            weight: req.body.weight,
            height: req.body.height,
            blood_type: req.body.blood_type,
            heart_rate: req.body.heart_rate,
            blood_pressure: req.body.blood_pressure,
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