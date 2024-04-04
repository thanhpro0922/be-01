const Product = require("../../model/product-model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
// [GET] /admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.status);

    // Đoạn bộ lọc

    const filterStatus = filterStatusHelper(req.query);
    let find = {
        // lấy ra những trường chưa bị xóa
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const products = await Product.find(find);

    // console.log(products);

    res.render("admin/pages/product/index", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
    });
};
