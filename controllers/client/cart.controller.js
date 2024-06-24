const Cart = require("../../model/cart.model");
const Product = require("../../model/product-model");

const productsHelper = require("../../helpers/product");

//@ [GET] /card/
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

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart,
    });
};

//@ [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({
        _id: cartId,
    });

    const existProductInCart = cart.products.find(
        (item) => item.product_id == productId
    );
    if (existProductInCart) {
        const newQuantity = quantity + existProductInCart.quantity;
        await Cart.updateOne(
            {
                _id: cartId,
                "products.product_id": productId,
            },
            {
                "products.$.quantity": newQuantity,
            }
        );
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity,
        };
        await Cart.updateOne(
            {
                _id: cartId,
            },
            {
                $push: { products: objectCart },
            }
        );
    }

    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!");
    res.redirect("back");
};
