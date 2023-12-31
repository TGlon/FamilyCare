const { Vaccination_History, Appointment, Vaccine_Types, User } = require("../models/index.model.js");
const createError = require("http-errors");

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 7) {
    const { vaccination, vaccine, doses, doctor, note, AppointmentId, VaccineTypeId } =
      req.body;
    const vaccinations = await Vaccination_History.findAll();
    for (let value of vaccinations) {
      if (
        value.vaccination == vaccination &&
        value.vaccine == vaccine &&
        value.doses == doses &&
        value.doctor == doctor &&
        value.note == note &&
        value.AppointmentId == AppointmentId &&
        value.VaccineTypeId == VaccineTypeId
      ) {
        return res.send({
          error: true,
          msg: `Đã tồn tại lịch tiêm vaccine ${value.vaccine}.`,
        });
      }
    }
    try {
      const document = await Vaccination_History.create({
        vaccination: req.body.vaccination,
        vaccine: req.body.vaccine,
        doses: req.body.doses,
        doctor: req.body.doctor,
        note: req.body.note || "",
        AppointmentId: req.body.AppointmentId,
        VaccineTypeId: req.body.VaccineTypeId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã ghi nhận thành công lịch sử tiêm vaccine ${document.vaccine}`,
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
    const documents = await Vaccination_History.findAll({
      include: [
        {
          model: Appointment, // Bảng bạn muốn join
          attributes: ['start_date', 'UserId'], // Chọn thuộc tính bạn muốn hiển thị
          include: [
            {
              model: User, // Bảng User
            },
          ],
        },
        {
          model: Vaccine_Types,
          attributes: ['name'],
        }
      ],
    });
    return res.send(documents.sort((a, b) => {
      const startDateA = a.Appointment.start_date;
      const startDateB = b.Appointment.start_date;
      return new Date(startDateB) - new Date(startDateA);
    }));
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all vaccination history!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Vaccination_History.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding vaccination history!"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const vaccination = await Vaccination_History.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await Vaccination_History.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "vaccination history not found"));
    }
    return res.send({
      msg: `Đã xoá thành công lịch sử tiêm ngừa vaccine  ${vaccination.vaccine}`,
      document: vaccination,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting vaccination history!"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const result = await Vaccination_History.destroy({
      where: {},
      truncate: true, // Truncate the table to remove all records
    });

    if (result === 0) {
      return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
    }
    //   return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting vaccination history"));
  }
};

// exports.update = async (req, res, next) => {
//   console.log("Update", req.body);
//   const { vaccine, doses, doctor, note, AppointmentId, VaccineTypeId } =
//     req.body;
//   try {
//     let vaccinations = [
//       await Vaccination_History.findOne({
//         where: {
//           _id: req.params.id,
//         },
//       }),
//     ];

//     vaccinations = vaccinations.filter((value, index) => {
//       return (
//         value.vaccine == vaccine &&
//         value.doses == doses &&
//         value.doctor == doctor &&
//         value.note == note &&
//         value.AppointmentId == AppointmentId &&
//         value.VaccineTypeId == VaccineTypeId
//       );
//     });

//     if (vaccinations.length == 0) {
//       const document = await Vaccination_History.update(
//         {
//           vaccine: req.body.vaccine,
//           doses: req.body.doses,
//           doctor: req.body.doctor,
//           note: req.body.note,
//           AppointmentId: req.body.AppointmentId,
//           VaccineTypeId: req.body.VaccineTypeId,
//         },
//         { where: { _id: req.params.id }, returning: true }
//       );
//       return res.send({
//         error: false,
//         msg: "Dữ liệu đã được thay đổi thành công.",
//       });
//     } else {
//       return res.send({
//         error: true,
//         msg: "Dữ liệu chưa được thay đổi.",
//       });
//     }
//   } catch (error) {
//     return next(createError(400, "Error update"));
//   }
// };
exports.update = async (req, res, next) => {
  console.log("Update", req.body);
  const { vaccination,vaccine, doses, doctor, AppointmentId, VaccineTypeId } = req.body;
  
  // Xác định giá trị mặc định cho trường "note" nếu không được cung cấp trong req.body
  const note = req.body.note || '';

  try {
    let vaccinations = [
      await Vaccination_History.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    vaccinations = vaccinations.filter((value, index) => {
      return (
        value.vaccination == vaccination &&
        value.vaccine == vaccine &&
        value.doses == doses &&
        value.doctor == doctor &&
        value.AppointmentId == AppointmentId &&
        value.note == note &&
        value.VaccineTypeId == VaccineTypeId
      );
    });

    if (vaccinations.length == 0) {
      const document = await Vaccination_History.update(
        {
          vaccination,
          vaccine,
          doses,
          doctor,
          note, // Sử dụng giá trị đã xác định ở trên
          AppointmentId,
          VaccineTypeId,
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

