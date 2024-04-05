const Product = require("../../model/product-model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
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

    //Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4,
        },
        req.query,
        countProducts
    );

    // trong mongoose hàm count hay countDocuments giống nhau, thích thì thay thành count cx đc
    const products = await Product.find(find)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    res.render("admin/pages/product/index", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    });
};
// [GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { status: status });
    res.redirect("back");
};
