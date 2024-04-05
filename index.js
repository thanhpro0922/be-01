const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express();
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.locals.preFixAdmin = systemConfig.preFixAdmin;

app.use(express.static("public"));

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
