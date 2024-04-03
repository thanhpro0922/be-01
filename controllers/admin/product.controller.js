const Product = require("../../model/product-model");
// [GET] /admin/products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        // lấy ra những trường chưa bị xóa
        deleted: false,
    });
    console.log(products);
    res.render("admin/pages/product/index", {
        pageTitle: "Trang sản phẩm",
        products: products
    });
};
