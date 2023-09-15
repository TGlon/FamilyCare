const { Medical_History } = require("../models/index.model.js");
const createError = require("http-errors");

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 5) {
    const { diagnosis, medical_condition, doctor, note, AppointmentId } =
      req.body;
    const medicals = await Medical_History.findAll();
    for (let value of medicals) {
      if (
        value.diagnosis == diagnosis &&
        value.medical_condition == medical_condition &&
        value.doctor == doctor &&
        value.note == note &&
        value.AppointmentId == AppointmentId
      ) {
        return res.send({
          error: true,
          msg: `Đã tồn tại tiền sử bệnh ${value.diagnosis}.`,
        });
      }
    }
    try {
      const document = await Medical_History.create({
        diagnosis: req.body.diagnosis,
        medical_condition: req.body.medical_condition,
        doctor: req.body.doctor,
        note: req.body.note,
        AppointmentId: req.body.AppointmentId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã ghi nhận thành công tiền sử bệnh ${document.diagnosis}`,
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
    const documents = await Medical_History.findAll({});
    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all medicals!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Medical_History.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding medical!"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const medical = await Medical_History.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await Medical_History.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "medical not found"));
    }
    return res.send({
      msg: `Đã xoá thành công tiền sử bệnh ${medical.diagnosis}`,
      document: medical,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting medical!"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const result = await Medical_History.destroy({
      where: {},
      truncate: true, // Truncate the table to remove all records
    });

    if (result === 0) {
      return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
    }
    //   return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting medicals"));
  }
};

exports.update = async (req, res, next) => {
  console.log("Update", req.body);
  const { diagnosis, medical_condition, doctor, note, AppointmentId } =
    req.body;
  try {
    let medicals = [
      await Medical_History.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    medicals = medicals.filter((value, index) => {
      return (
        value.diagnosis == diagnosis &&
        value.medical_condition == medical_condition &&
        value.doctor == doctor &&
        value.note == note &&
        value.AppointmentId == AppointmentId
      );
    });

    if (medicals.length == 0) {
      const document = await Medical_History.update(
        {
          diagnosis: req.body.diagnosis,
          medical_condition: req.body.medical_condition,
          doctor: req.body.doctor,
          note: req.body.note,
          AppointmentId: req.body.AppointmentId,
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
