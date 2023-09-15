const { Chronic_Disease } = require("../models/index.model.js");
const createError = require("http-errors");

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 6) {
    const {
      UserId,
      name,
      diagnosis_date,
      doctor,
      current_status,
      description,
    } = req.body;
    const chronics = await Chronic_Disease.findAll();
    for (let value of chronics) {
      if (
        value.UserId == UserId &&
        value.name == name &&
        value.diagnosis_date == diagnosis_date &&
        value.current_status == current_status &&
        value.description == description &&
        value.doctor == doctor
      ) {
        return res.send({
          error: true,
          msg: `Đã tồn tại loại bệnh mãn tính được chuẩn đoán ngày ${value.diagnosis_date}.`,
        });
      }
    }
    try {
      const document = await Chronic_Disease.create({
        name: req.body.name,
        diagnosis_date: req.body.diagnosis_date,
        current_status: req.body.current_status,
        doctor: req.body.doctor,
        description: req.body.description,
        UserId: req.body.UserId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã ghi nhận thành công bệnh mãn tính ngày ${document.diagnosis_date}`,
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
    const documents = await Chronic_Disease.findAll({});
    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all chronic!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Chronic_Disease.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding chronic!"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const chronic = await Chronic_Disease.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await Chronic_Disease.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "chronic not found"));
    }
    return res.send({
      msg: `Đã xoá thành công hồ sơ bệnh mãn tính ngày ${chronic.diagnosis_date}`,
      document: chronic,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting chronic!"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const result = await Chronic_Disease.destroy({
      where: {},
      truncate: true, // Truncate the table to remove all records
    });

    if (result === 0) {
      return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
    }
    //   return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting chronics"));
  }
};

exports.update = async (req, res, next) => {
  console.log("Update", req.body);
  const {
    UserId,
    name,
    diagnosis_date,
    doctor,
    current_status,
    description,
  } = req.body;
  try {
    let chronics = [
      await Chronic_Disease.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    chronics = chronics.filter((value, index) => {
      return (
        value.UserId == UserId &&
        value.name == name &&
        value.diagnosis_date == diagnosis_date &&
        value.current_status == current_status &&
        value.description == description &&
        value.doctor == doctor
      );
    });

    if (chronics.length == 0) {
      const document = await Chronic_Disease.update(
        {
            name: req.body.name,
            diagnosis_date: req.body.diagnosis_date,
            current_status: req.body.current_status,
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
