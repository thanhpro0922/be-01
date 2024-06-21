const Product = require("../../model/product-model");
const productsHelper = require("../../helpers/product");

//  [GET] /
module.exports.index = async (req, res) => {
    // todo Lấy ra sản phẩm nỏi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active",
    }).limit(6);
    const newProductFeatured =
        productsHelper.priceNewProducts(productsFeatured);
    // todo End Lấy ra sản phẩm nỏi bật

    // todo Hiển thị danh sách sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active",
    })
        .sort({ position: "desc" })
        .limit(6);

    const newProductsNew = productsHelper.priceNewProducts(productsNew);

    // todo End Hiển thị danh sách sản phẩm mới nhất

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductFeatured,
        productsNew: newProductsNew,
    });
};
