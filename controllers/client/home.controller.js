const Product = require("../../model/product-model");
const productsHelper = require("../../helpers/product");

//  [GET] /
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nỏi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active",
    }).limit(3);
    const newProduct = productsHelper.priceNewProducts(productsFeatured);

    // End Lấy ra sản phẩm nỏi bật
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProduct,
    });
};
