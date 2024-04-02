const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.preFixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
};
