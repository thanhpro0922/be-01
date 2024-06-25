const User = require("../../model/user.model");

module.exports.infoUser = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
        }).select("-password");
        console.log(user);
        if (user) {
            res.locals.user = user;
        }
    }
    next();
};
