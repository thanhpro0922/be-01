const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
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

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//Flash
app.use(cookieParser("DLKFKLGDFKLGD")); // key này mình điền bừa để khỏi bị lộ thôi, thích điền gì cx được
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End flash

//Ap local variables
app.locals.preFixAdmin = systemConfig.preFixAdmin;

app.use(express.static(`${__dirname}/public`));

//routes
routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
