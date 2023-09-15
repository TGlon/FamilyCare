const { Medicine } = require("../models/index.model.js");
const createError = require("http-errors");

exports.create = async (req, res, next) => {
  if (Object.keys(req.body).length === 6) {
    const { name, frequency, doses, note, MedicineTypeId, MedicalHistoryId } =
      req.body;
    const medicines = await Medicine.findAll();
    for (let value of medicines) {
      if (
        value.name == name &&
        value.frequency == frequency &&
        value.doses == doses &&
        value.note == note &&
        value.MedicineTypeId == MedicineTypeId &&
        value.MedicalHistoryId == MedicalHistoryId
      ) {
        return res.send({
          error: true,
          msg: `Đã tồn tại đơn thuốc.`,
        });
      }
    }
    try {
      const document = await Medicine.create({
        name: req.body.name,
        frequency: req.body.frequency,
        doses: req.body.doses,
        note: req.body.note,
        MedicineTypeId: req.body.MedicineTypeId,
        MedicalHistoryId: req.body.MedicalHistoryId,
      });
      return res.send({
        error: false,
        msg: `Bạn đã tạo thành công đơn thuốc`,
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
    const documents = await Medicine.findAll({});
    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error finding all medicines!"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const documents = await Medicine.findOne({
      where: {
        _id: req.params.id,
      },
    });
    return res.send(documents);
  } catch (error) {
    return next(createError(400, "Error finding medicine!"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const medicine = await Medicine.findOne({
      where: {
        _id: req.params.id,
      },
    });
    const result = await Medicine.destroy({
      where: {
        _id: req.params.id,
      },
    });

    if (result === 0) {
      return next(createError(404, "medicine not found"));
    }
    return res.send({
      msg: `Đã xoá thành công đơn thuốc`,
      document: medicine,
    });
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting medicine!"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const result = await Medicine.destroy({
      where: {},
      truncate: true, // Truncate the table to remove all records
    });

    if (result === 0) {
      return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
    }
    //   return res.sendStatus(204); // Return 204 No Content if all records were deleted successfully
  } catch (error) {
    console.log(error);
    return next(createError(400, "Error deleting medicines"));
  }
};

exports.update = async (req, res, next) => {
  console.log("Update", req.body);
  const { name, frequency, doses, note, MedicineTypeId, MedicalHistoryId } =
    req.body;
  try {
    let medicines = [
      await Medicine.findOne({
        where: {
          _id: req.params.id,
        },
      }),
    ];

    medicines = medicines.filter((value, index) => {
      return (
        value.name == name &&
        value.frequency == frequency &&
        value.doses == doses &&
        value.note == note &&
        value.MedicineTypeId == MedicineTypeId &&
        value.MedicalHistoryId == MedicalHistoryId
      );
    });

    if (medicines.length == 0) {
      const document = await Medicine.update(
        {
          name: req.body.name,
          frequency: req.body.frequency,
          doses: req.body.doses,
          note: req.body.note,
          MedicineTypeId: req.body.MedicineTypeId,
          MedicalHistoryId: req.body.MedicalHistoryId,
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
