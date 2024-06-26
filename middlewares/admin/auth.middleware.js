const Account = require("../../model/account.model");
const Role = require("../../model/role.model");
const systemConfig = require("../../config/system");
module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`/${systemConfig.preFixAdmin}/auth/login`);
        return;
    }
    const user = await Account.findOne({ token: req.cookies.token });
    if (!user) {
        res.redirect(`/${systemConfig.preFixAdmin}/auth/login`);
        return;
    }
    const role = await Role.findOne({
        _id: user.role_id,
    }).select("title permissions");
    res.locals.user = user; // locals là trả về toàn cục - nghĩa là ở đâu cũng xài được cái user
    res.locals.role = role;
    next();
};
