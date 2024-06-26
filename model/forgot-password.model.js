const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const forgotPassWordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 180, //# số giây hết hạn - 180 tương đương 3 phút
        },
    },
    { timestamps: true }
);
const ForgotPassword = mongoose.model(
    "ForgotPassword",
    forgotPassWordSchema,
    "forgot-password"
);

module.exports = ForgotPassword;
