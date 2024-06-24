const Cart = require("../../model/cart.model");
const Product = require("../../model/product-model");

const productsHelper = require("../../helpers/product");

module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId,
    });

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;

            const productInfo = await Product.findOne({
                _id: productId,
            });

            productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

            item.productInfo = productInfo;
            item.totalPrice = item.quantity * productInfo.priceNew; //@ Đây là tổng tiền của mỗi item
        }
    }

    cart.totalPrice = cart.products.reduce(
        (sum, item) => sum + item.totalPrice,
        0
    ); //@ Đây là tổng tiền của cả giỏ hàng

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart,
    });
};
