const { Appointment } = require("../models/index.model.js");
const createError = require("http-errors");

exports.create = async (req, res, next) => {
  if (
    req.body.UserId &&
    req.body.appointment_type &&
    req.body.start_date &&
    req.body.place &&
    req.body.status
  ) {
    const {
      UserId,
      appointment_type,
      start_date,
      place,
      status,
      note,
    } = req.body;

    const appointments = await Appointment.findAll();
    for (let value of appointments) {
      if (
        value.appointment_type == appointment_type &&
        value.start_date == start_date &&
        value.place == place &&
        value.status == status &&
        value.UserId == UserId
      ) {
        return res.send({
          error: true,
          msg: `Đã tồn tại cuộc hẹn ${value.appointment_type} vào ngày ${value.start_date}.`,
        });
      }
    }

    try {
      const document = await Appointment.create({
        appointment_type,
        start_date,
        place,
        status,
        note: note || '', // Sử dụng note hoặc chuỗi rỗng nếu note không được cung cấp
        UserId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công cuộc hẹn ${document.appointment_type} vào ngày ${document.start_date}.`,
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
    const documents = await Appointment.findAll({});
    return res.send(documents.sort((a, b) => new Date(b.start_date) - new Date(a.start_date)));
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all appointments!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Appointment.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding appointment!"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await Appointment.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "appointment not found"));
    }
    return res.send({
      msg: `Đã xoá thành công cuộc hẹn ${appointment.appointment_type} vào ngày ${appointment.start_date}`,
      document: appointment,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting appointment!"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const result = await Appointment.destroy({
      where: {},
      truncate: true, // Truncate the table to remove all records
    });

    if (result === 0) {
      return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
    }
    //   return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting appointments"));
  }
};

exports.update = async (req, res, next) => {
  console.log("Update", req.body);
  const {
    UserId,
    appointment_type,
    start_date,
    place,
    status,
    
  } = req.body;
  const note = req.body.note || '';
  try {
    let appointments = [
      await Appointment.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    appointments = appointments.filter((value, index) => {
      return (
        value.UserId == UserId &&
        value.appointment_type == appointment_type &&
        value.start_date == start_date &&
        value.place == place &&
        value.status == status &&
        value.note == note 
      );
    });

    if (appointments.length == 0) {
      const document = await Appointment.update(
        {
            appointment_type,
            start_date,
            place,
            status,
            note,
            UserId,
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
