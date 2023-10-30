//model
const {} = require("./app/models/index.model");
//
const { User, Appointment } = require("./app/models/index.model");
// npm packages
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
// initialize
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
//socket
const notification = require("./app/controllers/notification.controller");
//mail
const nodemailer = require("nodemailer");
const moment = require("moment");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const cron = require("node-cron");
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  cron.schedule("52 17 * * *", () => {
    socket.emit("notiEveryDay");
  });
  // Listen for the "appointment" event
  socket.on("appointment", async (NoticeData) => {
    // console.log("Received filtered appointments:", NoticeData);
    const app = await Appointment.findAll();
    const filteredAppointments = [];

    for (const appointment of app) {
      if (appointment._id === NoticeData.AppointmentId) {
        filteredAppointments.push(appointment);
      }
    }

    // console.log("Filtered appointments:", filteredAppointments);
    const usr = await User.findAll();
    const matchedUsers = [];

    for (const user of usr) {
      for (const appointment of filteredAppointments) {
        if (user._id === appointment.UserId) {
          matchedUsers.push(user);
        }
      }
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tlong2021315@gmail.com",
        pass: "mjpxlyyygfyqpwls",
      },
    });
    for (const appointment of filteredAppointments) {
      const user = matchedUsers.find((u) => u._id === appointment.UserId);
      if (user) {
        const startDate = new Date(appointment.start_date);
        const formattedDate = `${startDate.getDate()}/${startDate.getMonth() + 1}/${startDate.getFullYear()}`;
        const mailOptions = {
          from: "tlong2021315@gmail.com",
          to: user.email,
          subject: "Thông Báo Lịch Hẹn Sắp Tới",
          html: `Dear ${user.name}!
          <br> Chúng tôi xin gửi thông báo về cuộc hẹn ${appointment.appointment_type} diễn ra vào ngày ${formattedDate}. Chúng tôi rất mong bạn sẽ chú ý thời gian cuộc hẹn quan trọng này để sắp xếp công việc.
          <br>Thông tin chi tiết về cuộc họp:
          <br>- Ngày: ${formattedDate}
          <br>- Địa điểm: ${appointment.place}
          <br>- ${appointment.note != null ? `Ghi chú: ${appointment.note}` : 'Ghi chú: '}    
          <br>Xin lỗi nếu thông tin này làm phiền bạn, và nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua địa chỉ email hoặc số điện thoại sau:
          <br>-Email: tlong2021315@email.com
          <br>-Số điện thoại: +84 941 636 509
          <br>
          <br>Trân trọng,
          <br>Family Care
          `,
        };
        const info = await transporter.sendMail(mailOptions);
      }
    }
    io.emit("appointmentNoti");
  });
});

// const http = require("http");
// const server = http.createServer(app);
// initialize router
const AccountRouter = require("./app/routes/account.route");
const UserRouter = require("./app/routes/user.route");
const WorkUserRouter = require("./app/routes/work_user.route");
const CompanyRouter = require("./app/routes/company.route");
const HealthStatsticsRouter = require("./app/routes/health_statistics.route");
const AllergyRouter = require("./app/routes/allergy.route");
const ChronicRouter = require("./app/routes/chronic.route");
const AppointmentRouter = require("./app/routes/appointment.route");
const VaccineTypesRouter = require("./app/routes/vaccine_type.route");
const VaccinationHistoryRouter = require("./app/routes/vacination.route");
const MedicineTypeRouter = require("./app/routes/medicine_type.route");
const MedicalHistoryRouter = require("./app/routes/medical_history.route");
const MedicineRouter = require("./app/routes/medicine.route");
const FamilyRouter = require("./app/routes/family.route");
const NotificationRouter = require("./app/routes/notification.route");
const UserFamilyRouter = require("./app/routes/user_family.route");
const RoleRouter = require("./app/routes/role.route");
const Role_PermissionRouter = require("./app/routes/role_permisson.route");
const PermissionRouter = require("./app/routes/permission.route");
const LoginRouter = require("./app/routes/login.route");
// const MailRouter = require("./app/routes/mail.route");
// use router
app.use("/api/accounts", AccountRouter);
app.use("/api/users", UserRouter);
app.use("/api/works", WorkUserRouter);
app.use("/api/companys", CompanyRouter);
app.use("/api/healthstatistics", HealthStatsticsRouter);
app.use("/api/allergys", AllergyRouter);
app.use("/api/chronics", ChronicRouter);
app.use("/api/appointments", AppointmentRouter);
app.use("/api/vaccinetypes", VaccineTypesRouter);
app.use("/api/vaccinationhistories", VaccinationHistoryRouter);
app.use("/api/medicinetypes", MedicineTypeRouter);
app.use("/api/medicalhistories", MedicalHistoryRouter);
app.use("/api/medicines", MedicineRouter);
app.use("/api/families", FamilyRouter);
app.use("/api/notifications", NotificationRouter);
app.use("/api/userfamilies", UserFamilyRouter);
app.use("/api/roles", RoleRouter);
app.use("/api/permissions", PermissionRouter);
app.use("/api/role_permissions", Role_PermissionRouter);
app.use("/api/login", LoginRouter);
// app.use("/api/mail", MailRouter);
// start server
const { config } = require("./app/config/index");
const { log } = require("console");
const PORT = config.app.port;
server.listen(PORT, () => {
  console.log(`Server is listening on port 3000`);
});
// // config path
// const pathPublic = path.join(__dirname, "./app/public");
// app.use("/public", express.static(pathPublic));

// simple route
app.get("/", (req, res, next) => {
  return res.send({
    message: "Welcome to Health Care",
  });
});

// handles before https methods
// const convertToLowercase = (req, res, next) => {
//   for (let key in req.body) {
//     if (typeof req.body[key] === "string") {
//       req.body[key] = req.body[key].toLowerCase();
//     }
//   }
//   next();
// };

// app.use(convertToLowercase);

// check errors
app.use((req, res, next) => {
  return next(createError(404, "Resource Not Found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// exports
module.exports = app;
