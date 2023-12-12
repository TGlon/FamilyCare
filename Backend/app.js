//model
const {} = require("./app/models/index.model");
//
const {
  User,
  Appointment,
  SetTime,
  Notification,
  SetTimeNotiAdmin
} = require("./app/models/index.model");
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
io.on("connection", async(socket) => {
  console.log("A User Connected");
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
  
  cron.schedule("15 00 * * *", async () => {
    const app = await Appointment.findAll();
    const currentDate = moment();
    // Định dạng ngày theo định dạng mong muốn
    const formattedDate = currentDate.format("YYYY-MM-DD");
    // Lọc các mục có start_date là ngày formattedDate hoặc sau ngày formattedDate
    const filteredAppointments = app.filter((appointment) =>
      moment(formattedDate).isBefore(appointment.start_date, "day")
    );

    // Log UserId của các filteredAppointments
    // Sử dụng map để trích xuất UserId và chuyển thành Set để loại bỏ giá trị trùng lặp
    const userIdsSet = new Set(
      filteredAppointments.map((appointment) => appointment.UserId)
    );
    // Chuyển Set thành mảng nếu cần
    const uniqueUserIds = Array.from(userIdsSet);
    // Tìm tất cả các SetTime
    const allSetTimes = await SetTime.findAll();
    // Lọc SetTime có giá trị UserId tương ứng có trong uniqueUserIds
    const matchingSetTimes = allSetTimes.filter((setTime) =>
      uniqueUserIds.includes(setTime.UserId)
    );
    // Lặp qua từng uniqueUserId để xử lý từng user
    for (const userId of uniqueUserIds) {
      // Lấy tất cả các SetTime của user hiện tại
      const userSetTimes = matchingSetTimes.filter(
        (setTime) => setTime.UserId === userId
      );
      // Lặp qua từng SetTime của user
      for (const setTime of userSetTimes) {
        // Tính ngày thông báo trước của user
        const notificationDate = moment(formattedDate).add(setTime.day, "days");
        // Lọc các cuộc hẹn có start_date bằng với ngày thông báo trước của user
        const appointmentsToNotify = filteredAppointments.filter(
          (appointment) =>
            moment(appointment.start_date).isSame(notificationDate, "day")
        );
        // Log ra thông báo cho user nếu có cuộc hẹn cần thông báo
        if (appointmentsToNotify.length > 0) {
          console.log(
            `User ${userId} has appointments to be notified on ${notificationDate.format(
              "YYYY-MM-DD"
            )}:`
          );
          appointmentsToNotify.forEach(async (appointment) => {
            console.log(
              `- Appointment ID: ${appointment._id}, Start Date: ${appointment.start_date}`
            );
            const originalStartDate = new Date(appointment.start_date);
            const formattedStartDate = `${originalStartDate.getDate().toString().padStart(2, '0')}-${(originalStartDate.getMonth() + 1).toString().padStart(2, '0')}-${originalStartDate.getFullYear()}`;

            const NoticeData = {
              title: `Thông Báo`,
              content: `Sắp Tới Ngày Hẹn ${appointment.appointment_type} Tại ${appointment.place} Ngày ${formattedStartDate}`,
              isRead: false,
              AppointmentId: appointment._id,
            };
            // console.log("NoticeData new",NoticeData);
            const getAllNoti = await Notification.findAll();
            console.log("getAllNoti", getAllNoti);
            // Kiểm tra xem NoticeData có tồn tại trong getAllNoti không
            const isNoticeDataExists = getAllNoti.some(
              (noti) => noti.AppointmentId === NoticeData.AppointmentId
            );
            if (isNoticeDataExists) {
              console.log("Thông báo đã tồn tại");
            } else {
              socket.emit("a");
              await Notification.create(NoticeData);
              console.log("Thông báo chưa tồn tại", NoticeData);
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
                const user = matchedUsers.find(
                  (u) => u._id === appointment.UserId
                );
                if (user) {
                  const startDate = new Date(appointment.start_date);
                  const formattedDate = `${startDate.getDate()}/${
                    startDate.getMonth() + 1
                  }/${startDate.getFullYear()}`;
                  const mailOptions = {
                    from: "tlong2021315@gmail.com",
                    to: user.email,
                    subject: "Thông Báo Lịch Hẹn Sắp Tới",
                    html: `Dear ${user.name}!
          <br> Chúng tôi xin gửi thông báo về cuộc hẹn ${
            appointment.appointment_type
          } diễn ra vào ngày ${formattedDate}. Chúng tôi rất mong bạn sẽ chú ý thời gian cuộc hẹn quan trọng này để sắp xếp công việc.
          <br>Thông tin chi tiết về cuộc họp:
          <br>- Ngày: ${formattedDate}
          <br>- Địa điểm: ${appointment.place}
          <br>- ${
            appointment.note != null
              ? `Ghi chú: ${appointment.note}`
              : "Ghi chú: "
          }    
          <br>Xin lỗi nếu thông tin này làm phiền bạn, và nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua địa chỉ email hoặc số điện thoại sau:
          <br>- Email: tlong2021315@email.com
          <br>- Số điện thoại: +84 941 636 509
          <br>
          <br>Trân trọng,
          <br>Family Care
          `,
                  };
                  const info = await transporter.sendMail(mailOptions);
                }
              }
            }
          });
        }
      }
    }
  });
  // socket.on("appointment", async (NoticeData) => {
  //   // console.log("Received filtered appointments:", NoticeData);
  //   const app = await Appointment.findAll();
  //   const filteredAppointments = [];

  //   for (const appointment of app) {
  //     if (appointment._id === NoticeData.AppointmentId) {
  //       filteredAppointments.push(appointment);
  //     }
  //   }

  //   // console.log("Filtered appointments:", filteredAppointments);
  //   const usr = await User.findAll();
  //   const matchedUsers = [];

  //   for (const user of usr) {
  //     for (const appointment of filteredAppointments) {
  //       if (user._id === appointment.UserId) {
  //         matchedUsers.push(user);
  //       }
  //     }
  //   }
  //   const transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: "tlong2021315@gmail.com",
  //       pass: "mjpxlyyygfyqpwls",
  //     },
  //   });
  //   for (const appointment of filteredAppointments) {
  //     const user = matchedUsers.find((u) => u._id === appointment.UserId);
  //     if (user) {
  //       const startDate = new Date(appointment.start_date);
  //       const formattedDate = `${startDate.getDate()}/${
  //         startDate.getMonth() + 1
  //       }/${startDate.getFullYear()}`;
  //       const mailOptions = {
  //         from: "tlong2021315@gmail.com",
  //         to: user.email,
  //         subject: "Thông Báo Lịch Hẹn Sắp Tới",
  //         html: `Dear ${user.name}!
  //         <br> Chúng tôi xin gửi thông báo về cuộc hẹn ${
  //           appointment.appointment_type
  //         } diễn ra vào ngày ${formattedDate}. Chúng tôi rất mong bạn sẽ chú ý thời gian cuộc hẹn quan trọng này để sắp xếp công việc.
  //         <br>Thông tin chi tiết về cuộc họp:
  //         <br>- Ngày: ${formattedDate}
  //         <br>- Địa điểm: ${appointment.place}
  //         <br>- ${
  //           appointment.note != null
  //             ? `Ghi chú: ${appointment.note}`
  //             : "Ghi chú: "
  //         }    
  //         <br>Xin lỗi nếu thông tin này làm phiền bạn, và nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua địa chỉ email hoặc số điện thoại sau:
  //         <br>-Email: tlong2021315@email.com
  //         <br>-Số điện thoại: +84 941 636 509
  //         <br>
  //         <br>Trân trọng,
  //         <br>Family Care
  //         `,
  //       };
  //       const info = await transporter.sendMail(mailOptions);
  //     }
  //   }
  //   io.emit("appointmentNoti");
  // });
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
// const Role_PermissionRouter = require("./app/routes/role_permisson.route");
const SetTimeAdminRouter = require("./app/routes/settimeadmin.route")
// const PermissionRouter = require("./app/routes/permission.route");
const LoginRouter = require("./app/routes/login.route");
// const MailRouter = require("./app/routes/mail.route");
const SetTimeRouter = require("./app/routes/settime.route");
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
// app.use("/api/permissions", PermissionRouter);
// app.use("/api/role_permissions", Role_PermissionRouter);
app.use("/api/login", LoginRouter);
// app.use("/api/mail", MailRouter);
app.use("/api/settimes", SetTimeRouter);
app.use("/api/settimenotiadmins", SetTimeAdminRouter)
// start server
const { config } = require("./app/config/index");
const { log, Console } = require("console");
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
