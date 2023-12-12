const { Allergy, User } = require("../models/index.model.js");
const createError = require("http-errors");

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 7) {
    const {
      UserId,
      allergy_type,
      has_allergy,
      detection_date,
      severity,
      description,
      doctor,
    } = req.body;
    const allergys = await Allergy.findAll();
    for (let value of allergys) {
      if (
        value.UserId == UserId &&
        value.allergy_type == allergy_type &&
        value.has_allergy == has_allergy &&
        value.detection_date == detection_date &&
        value.severity == severity &&
        value.description == description &&
        value.doctor == doctor
      ) {
        return res.send({
          error: true,
          msg: `Đã tồn tại loại bệnh dị ứng được phát hiện ngày ${value.detection_date}.`,
        });
      }
    }
    try {
      const document = await Allergy.create({
        allergy_type: req.body.allergy_type,
        has_allergy: req.body.has_allergy,
        detection_date: req.body.detection_date,
        severity: req.body.severity,
        doctor: req.body.doctor,
        description: req.body.description,
        UserId: req.body.UserId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã ghi nhận thành công bệnh dị ứng ngày ${document.detection_date}`,
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
    const documents = await Allergy.findAll({
      include: [{
        model: User,
      }]
    });
    return res.send( documents.sort((a, b) => new Date(b.detection_date) - new Date(a.detection_date)));
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all allergy!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Allergy.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding allergys!"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const allergy = await Allergy.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await Allergy.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "allergys not found"));
    }
    return res.send({
      msg: `Đã xoá thành công hồ sơ dị ứng ngày ${allergy.detection_date}`,
      document: allergy,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting allergy!"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const result = await Allergy.destroy({
      where: {},
      truncate: true, // Truncate the table to remove all records
    });

    if (result === 0) {
      return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
    }
    //   return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting allergys"));
  }
};

exports.update = async (req, res, next) => {
  console.log("Update", req.body);
  const {
    UserId,
    allergy_type,
    has_allergy,
    detection_date,
    severity,
    description,
    doctor,
  } = req.body;
  try {
    let allergys = [
      await Allergy.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    allergys = allergys.filter((value, index) => {
      return (
        value.UserId == UserId &&
        value.allergy_type == allergy_type &&
        value.has_allergy == has_allergy &&
        value.detection_date == detection_date &&
        value.severity == severity &&
        value.description == description &&
        value.doctor == doctor
      );
    });

    if (allergys.length == 0) {
      const document = await Allergy.update(
        {
          allergy_type: req.body.allergy_type,
          has_allergy: req.body.has_allergy,
          detection_date: req.body.detection_date,
          severity: req.body.severity,
          doctor: req.body.doctor,
          description: req.body.description,
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
