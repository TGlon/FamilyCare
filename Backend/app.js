//model
const {} = require("./app/models/index.model");
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
const http = require("http");
const server = http.createServer(app);
// initialize router
const AccountRouter = require('./app/routes/account.route');
const UserRouter = require('./app/routes/user.route');
const WorkUserRouter = require('./app/routes/work_user.route');
const CompanyRouter = require('./app/routes/company.route');
const HealthStatsticsRouter = require('./app/routes/health_statistics.route');
const AllergyRouter = require('./app/routes/allergy.route');
const ChronicRouter = require('./app/routes/chronic.route');
const AppointmentRouter = require('./app/routes/appointment.route');
const VaccineTypesRouter = require('./app/routes/vaccine_type.route');
const VaccinationHistoryRouter = require('./app/routes/vacination.route');
const MedicineTypeRouter = require('./app/routes/medicine_type.route');
const MedicalHistoryRouter = require('./app/routes/medical_history.route');
const MedicineRouter = require('./app/routes/medicine.route');
const FamilyRouter = require('./app/routes/family.route');
const NotificationRouter = require('./app/routes/notification.route');
const UserFamilyRouter = require('./app/routes/user_family.route');
const RoleRouter = require('./app/routes/role.route');
const Role_PermissionRouter = require('./app/routes/role_permisson.route');
const PermissionRouter = require('./app/routes/permission.route');
const LoginRouter = require('./app/routes/login.route');
// use router
app.use('/api/accounts', AccountRouter);
app.use('/api/users', UserRouter);
app.use('/api/works', WorkUserRouter);
app.use('/api/companys', CompanyRouter);
app.use('/api/healthstatistics', HealthStatsticsRouter);
app.use('/api/allergys', AllergyRouter);
app.use('/api/chronics', ChronicRouter);
app.use('/api/appointments', AppointmentRouter);
app.use('/api/vaccinetypes', VaccineTypesRouter);
app.use('/api/vaccinationhistories', VaccinationHistoryRouter);
app.use('/api/medicinetypes', MedicineTypeRouter);
app.use('/api/medicalhistories', MedicalHistoryRouter);
app.use('/api/medicines', MedicineRouter);
app.use('/api/families', FamilyRouter);
app.use('/api/notifications', NotificationRouter);
app.use('/api/userfamilies', UserFamilyRouter);
app.use('/api/roles', RoleRouter);
app.use('/api/permissions', PermissionRouter);
app.use('/api/role_permissions', Role_PermissionRouter);
app.use('/api/login', LoginRouter);
// start server
const {config} = require("./app/config/index");
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
