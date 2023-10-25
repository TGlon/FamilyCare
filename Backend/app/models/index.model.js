const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../config/index");
const crypto = require("crypto");

const setPrimary = {
  type: DataTypes.STRING,
  defaultValue: () => uuidv4(),
  primaryKey: true,
};

const encryptionKey = "11032002200220011103200220022001";
const iv = "b2009872b1913315";

const setEncrypt = (value, name, modelInstance) => {
  if (value.length == 0) {
    let encrypted = "";
    modelInstance.setDataValue(name, encrypted);
  } else {
    const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
    let encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");
    modelInstance.setDataValue(name, encrypted);
  }
};

const getDecrypt = (name, modelInstance) => {
  const value = modelInstance.getDataValue(name);
  if (value) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
    let decrypted = decipher.update(value, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
  return null;
};

//Create models
const User = sequelize.define("User", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên người dùng không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
  gender: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Giới tính không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("gender", this);
    },
    set(value) {
      setEncrypt(value, "gender", this);
    },
  },
  birthday: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ngày sinh không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("birthday", this);
    },
    set(value) {
      setEncrypt(value, "birthday", this);
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Địa chỉ không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("address", this);
    },
    set(value) {
      setEncrypt(value, "address", this);
    },
  },
  passport: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "CCCD không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("passport", this);
    },
    set(value) {
      setEncrypt(value, "passport", this);
    },
  },
  digital_identity: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Mã định danh điện tử không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("digital_identity", this);
    },
    set(value) {
      setEncrypt(value, "digital_identity", this);
    },
  },
  insurance: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Bảo hiểm không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("insurance", this);
    },
    set(value) {
      setEncrypt(value, "insurance", this);
    },
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "SĐT không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("phone", this);
    },
    set(value) {
      setEncrypt(value, "phone", this);
    },
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Email không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("email", this);
    },
    set(value) {
      setEncrypt(value, "email", this);
    },
  },
  nation: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Quốc tịch không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("nation", this);
    },
    set(value) {
      setEncrypt(value, "nation", this);
    },
  },
  ethnic: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Dân tộc không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("ethnic", this);
    },
    set(value) {
      setEncrypt(value, "ethnic", this);
    },
  },
});
const Health_Statistics = sequelize.define("Health_Statistics", {
  _id: setPrimary,
  recording_date: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ngày ghi nhận không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("recording_date", this);
    },
    set(value) {
      setEncrypt(value, "recording_date", this);
    },
  },
  weight: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Cân nặng không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("weight", this);
    },
    set(value) {
      setEncrypt(value, "weight", this);
    },
  },
  height: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Chiều cao không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("height", this);
    },
    set(value) {
      setEncrypt(value, "height", this);
    },
  },
  blood_type: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Nhóm máu không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("blood_type", this);
    },
    set(value) {
      setEncrypt(value, "blood_type", this);
    },
  },
  heart_rate: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Nhịp tim không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("heart_rate", this);
    },
    set(value) {
      setEncrypt(value, "heart_rate", this);
    },
  },
  blood_pressure: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Huyết áp không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("blood_pressure", this);
    },
    set(value) {
      setEncrypt(value, "blood_pressure", this);
    },
  },
});
const Role = sequelize.define("Role", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên chức năng không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});

const Account = sequelize.define("Account", {
  _id: setPrimary,
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên đăng nhập không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("username", this);
    },
    set(value) {
      setEncrypt(value, "username", this);
    },
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Mật khẩu không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("password", this);
    },
    set(value) {
      setEncrypt(value, "password", this);
    },
  },
});
const Family = sequelize.define("Family", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên gia đình không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "DC gia đình không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("address", this);
    },
    set(value) {
      setEncrypt(value, "address", this);
    },
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "sdt gia đình không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("phone", this);
    },
    set(value) {
      setEncrypt(value, "phone", this);
    },
  },
});
const Work_User = sequelize.define("Work_User", {
  _id: setPrimary,
  current_workplace: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Công việc hiện tại không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("current_workplace", this);
    },
    set(value) {
      setEncrypt(value, "current_workplace", this);
    },
  },
  current_position: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên công ty hiện tại không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("current_position", this);
    },
    set(value) {
      setEncrypt(value, "current_position", this);
    },
  },
});
const Company = sequelize.define("Company", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên công ty hiện tại không được bỏ trống.",
      }  
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});
const Allergy = sequelize.define("Allergy", {
  _id: setPrimary,
  allergy_type: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Loại dị ứng không được bỏ trống",
      }
    },
    get() {
      return getDecrypt("allergy_type", this);
    },
    set(value) {
      setEncrypt(value, "allergy_type", this);
    },
  },
  has_allergy: {
    type: DataTypes.TEXT,
    allowNull: false,
    // validate: {
    //   msg: "Loại dị ứng không được bỏ trống",
    // },
    get() {
      return getDecrypt("has_allergy", this);
    },
    set(value) {
      setEncrypt(value, "has_allergy", this);
    },
  },
  detection_date: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ngày phát hiện không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("detection_date", this);
    },
    set(value) {
      setEncrypt(value, "detection_date", this);
    },
  },
  severity: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Mức độ không được bỏ trống.", 
      }
    },
    get() {
      return getDecrypt("severity", this);
    },
    set(value) {
      setEncrypt(value, "severity", this);
    },
  },
  doctor: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên bác sĩ không được bỏ trống.", 
      }
    },
    get() {
      return getDecrypt("doctor", this);
    },
    set(value) {
      setEncrypt(value, "doctor", this);
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    // validate: {
    //   msg: "Mô tả không được bỏ trống."
    // },
    get() {
      return getDecrypt("description", this);
    },
    set(value) {
      setEncrypt(value, "description", this);
    },
  },
});
const Chronic_Disease = sequelize.define("Chronic_Disease", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên bệnh mãn tính không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
  diagnosis_date: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ngày chuẩn đoán không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("diagnosis_date", this);
    },
    set(value) {
      setEncrypt(value, "diagnosis_date", this);
    },
  },
  doctor: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên bác sĩ không được bỏ trống.", 
      }
    },
    get() {
      return getDecrypt("doctor", this);
    },
    set(value) {
      setEncrypt(value, "doctor", this);
    },
  },
  current_status: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Trạng thái hiện tại không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("current_status", this);
    },
    set(value) {
      setEncrypt(value, "current_status", this);
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    // validate: {
    //   msg: "Mô tả không được bỏ trống."
    // },
    get() {
      return getDecrypt("description", this);
    },
    set(value) {
      setEncrypt(value, "description", this);
    },
  },
});
const Appointment = sequelize.define("Appointment", {
  _id: setPrimary,
  appointment_type: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Loại cuộc hẹn không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("appointment_type", this);
    },
    set(value) {
      setEncrypt(value, "appointment_type", this);
    },
  },
  start_date: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ngày bắt đầu cuộc hẹn không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("start_date", this);
    },
    set(value) {
      setEncrypt(value, "start_date", this);
    },
  },
  place: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Địa điểm cuộc hẹn không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("place", this);
    },
    set(value) {
      setEncrypt(value, "place", this);
    },
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Trạng thái cuộc hẹn không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("status", this);
    },
    set(value) {
      setEncrypt(value, "status", this);
    },
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    // validate: {
    //   msg: "Trạng thái cuộc hẹn không được bỏ trống."
    // },
    get() {
      return getDecrypt("note", this);
    },
    set(value) {
      setEncrypt(value, "note", this);
    },
  },
});
const Vaccination_History = sequelize.define("Vaccination_History", {
  _id: setPrimary,
  vaccination: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên vaccination không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("vaccination", this);
    },
    set(value) {
      setEncrypt(value, "vaccination", this);
    },
  },
  vaccine: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên vaccine không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("vaccine", this);
    },
    set(value) {
      setEncrypt(value, "vaccine", this);
    },
  },
  // vaccination_date: {
  //   type: DataTypes.TEXT,
  //   allowNull: false,
  //   validate: {
  //     notEmpty: {
  //       msg: "Ngày tiêm vaccine không được bỏ trống.",
  //     }
  //   },
  //   get() {
  //     return getDecrypt("vaccination_date", this);
  //   },
  //   set(value) {
  //     setEncrypt(value, "vaccination_date", this);
  //   },
  // },
  doses: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Liều lượng không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("doses", this);
    },
    set(value) {
      setEncrypt(value, "doses", this);
    },
  },
  doctor: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên bác sĩ không được bỏ trống.", 
      }
    },
    get() {
      return getDecrypt("doctor", this);
    },
    set(value) {
      setEncrypt(value, "doctor", this);
    },
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    // validate: {
    //   msg: "Trạng thái cuộc hẹn không được bỏ trống."
    // },
    get() {
      return getDecrypt("note", this);
    },
    set(value) {
      setEncrypt(value, "note", this);
    },
  },
});
const Vaccine_Types = sequelize.define("Vaccine_Types", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên loại vaccine không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});
const Medical_History = sequelize.define("Medical_History", {
  _id: setPrimary,
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Chuẩn đoán không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("diagnosis", this);
    },
    set(value) {
      setEncrypt(value, "diagnosis", this);
    },
  },
  // date: {
  //   type: DataTypes.TEXT,
  //   allowNull: false,
  //   validate: {
  //     notEmpty: {
  //       msg: "Ngày chuẩn đoán không được bỏ trống.",
  //     }
  //   },
  //   get() {
  //     return getDecrypt("date", this);
  //   },
  //   set(value) {
  //     setEncrypt(value, "date", this);
  //   },
  // },
  medical_condition: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tình trạng sức khỏe không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("medical_condition", this);
    },
    set(value) {
      setEncrypt(value, "medical_condition", this);
    },
  },
  doctor: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên bác sĩ không được bỏ trống.", 
      }
    },
    get() {
      return getDecrypt("doctor", this);
    },
    set(value) {
      setEncrypt(value, "doctor", this);
    },
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    // validate: {
    //   msg: "Trạng thái cuộc hẹn không được bỏ trống."
    // },
    get() {
      return getDecrypt("note", this);
    },
    set(value) {
      setEncrypt(value, "note", this);
    },
  },
});
const Medicine = sequelize.define("Medicine", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên thuốc không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
  // start_date: {
  //   type: DataTypes.TEXT,
  //   allowNull: false,
  //   validate: {
  //     msg: "Ngày bắt đầu không được bỏ trống.",
  //   },
  //   get() {
  //     return getDecrypt("start_date", this);
  //   },
  //   set(value) {
  //     setEncrypt(value, "start_date", this);
  //   },
  // },
  frequency: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tần suất dùng thuốc không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("frequency", this);
    },
    set(value) {
      setEncrypt(value, "frequency", this);
    },
  },
  doses: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Liều lượng không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("doses", this);
    },
    set(value) {
      setEncrypt(value, "doses", this);
    },
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    // validate: {
    //   msg: "Ghi chú không được bỏ trống."
    // },
    get() {
      return getDecrypt("note", this);
    },
    set(value) {
      setEncrypt(value, "note", this);
    },
  },
});
// const Medicine_Type = sequelize.define("Medicine_Type", {
//   _id: setPrimary,
//   name: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//     validate: {
//       notEmpty: {
//         msg: "Tên loại thuốc không được bỏ trống.",
//       }
//     },
//     get() {
//       return getDecrypt("name", this);
//     },
//     set(value) {
//       setEncrypt(value, "name", this);
//     },
//   },
// });
const Notification = sequelize.define("Notification", {
  _id: setPrimary,
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tiêu đề không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("title", this);
    },
    set(value) {
      setEncrypt(value, "title", this);
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Nội dung không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("content", this);
    },
    set(value) {
      setEncrypt(value, "content", this);
    },
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
const Permission = sequelize.define("Permission", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên quyền không được bỏ trống.",
      },
    },
    get() {
      return getDecrypt("name", this);
    },
    set(value) {
      setEncrypt(value, "name", this);
    },
  },
});
// Relationships
// One to Many
User.hasMany(Work_User, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Work_User.belongsTo(User, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// --------------------- //
Company.hasMany(Work_User, {
  foreignKey: "CompanyId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Work_User.belongsTo(Company, {
  foreignKey: "CompanyId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// --------------------- //
User.hasMany(Allergy, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Allergy.belongsTo(User, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// -------------------- //
User.hasMany(Chronic_Disease, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Chronic_Disease.belongsTo(User, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// --------------------- //
User.hasMany(Appointment, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Appointment.belongsTo(User, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// --------------------- //
Appointment.hasMany(Vaccination_History, {
  foreignKey: "AppointmentId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Vaccination_History.belongsTo(Appointment, {
  foreignKey: "AppointmentId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// Vaccination_History.hasMany(Appointment, {
//   foreignKey: "Vaccination_HistoryId",
//   onDelete: "SET NULL",
//   onUpdate: "CASCADE",
// });
// Appointment.belongsTo(Vaccination_History, {
//   foreignKey: "Vaccination_HistoryId",
//   onDelete: "SET NULL",
//   onUpdate: "CASCADE",
// });
// --------------------- //
Vaccine_Types.hasMany(Vaccination_History, {
  foreignKey: "VaccineTypeId",
  // onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Vaccination_History.belongsTo(Vaccine_Types, {
  foreignKey: "VaccineTypeId",
  // onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// --------------------- //
Appointment.hasMany(Medical_History, {
  foreignKey: "AppointmentId",
  // onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Medical_History.belongsTo(Appointment, {
  foreignKey: "AppointmentId",
  // onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// Medical_History.hasMany(Appointment, {
//   foreignKey: "Medical_HistoryId",
//   // onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });
// Appointment.belongsTo(Medical_History, {
//   foreignKey: "Medical_HistoryId",
//   // onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });
// --------------------- //
// Medicine_Type.hasMany(Medicine, {
//   foreignKey: "MedicineTypeId",
//   // onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });
// Medicine.belongsTo(Medicine_Type, {
//   foreignKey: "MedicineTypeId",
//   // onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });
// ------------------------------ //
Role.hasMany(Account, {
  foreignKey: "roleId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Account.belongsTo(Role, {
  foreignKey: "roleId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//One to One
User.hasOne(Health_Statistics, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Health_Statistics.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// --------------------- //
User.hasOne(Account, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Account.belongsTo(User, {
  onDelete: "CASCADE", 
  onUpdate: "CASCADE",
});
// --------------------- //
Medical_History.hasOne(Medicine, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Medicine.belongsTo(Medical_History, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// -------------------- //
Appointment.hasOne(Notification, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Notification.belongsTo(Appointment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// Many to Many
const User_Family = sequelize.define("User_Family", {
  relationship: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Mối quan hệ không được bỏ trống.",
      }
    },
    get() {
      return getDecrypt("relationship", this);
    },
    set(value) {
      setEncrypt(value, "relationship", this);
    },
  },
});
User.belongsToMany(Family, {
  through: User_Family,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Family.belongsToMany(User, {
  through: User_Family,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// ----------------------- //
const Role_Permission = sequelize.define("Role_Permission", {});
Role.belongsToMany(Permission, {
  through: Role_Permission,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Permission.belongsToMany(Role, {
  through: Role_Permission,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// Sync the model with the database
User.sync();
Health_Statistics.sync();
Account.sync();
Family.sync();
User_Family.sync();
Work_User.sync();
Company.sync();
Allergy.sync();
Chronic_Disease.sync();
Appointment.sync();
Vaccination_History.sync();
Vaccine_Types.sync();
Medical_History.sync();
Medicine.sync();
// Medicine_Type.sync();
Notification.sync();
Role.sync();
Permission.sync();
Role_Permission.sync();
module.exports = {
  User,
  Health_Statistics,
  Account,
  Family,
  User_Family,
  Work_User,
  Company,
  Allergy,
  Chronic_Disease,
  Appointment,
  Vaccination_History,
  Vaccine_Types,
  Medical_History,
  Medicine,
  // Medicine_Type,
  Notification,
  Role,
  Role_Permission,
  Permission
};
