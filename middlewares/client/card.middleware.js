const Cart = require("../../model/cart.model");

module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        const expiresTime = 1000 * 60 * 60 * 24 * 365; //# Mặc định 1000 là 1 giây, đây muốn lưu 1 năm thì nhân 60 thành 1p, * 60 thành 1h, nhân 24 thành 1 ngày, nhân 365 thành 1 năm
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime),
        });
    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId,
        });

        cart.totalQuantity = cart.products.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
        res.locals.miniCart = cart;
    }
    next();
};
