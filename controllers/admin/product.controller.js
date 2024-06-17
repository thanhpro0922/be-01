const Product = require("../../model/product-model");
const ProductCategory = require("../../model/product-category.model");
const Account = require("../../model/account.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");
// [GET] /admin/products
module.exports.index = async (req, res) => {
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

    //Sort

    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }

    //End sort
    // trong mongoose hàm count hay countDocuments giống nhau, thích thì thay thành count cx đc
    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    for (const product of products) {
        const user = await Account.findOne({
            _id: product.createBy.account_id,
        });

        if (user) {
            product.accountFullName = user.fullName;
        }
    }

    res.render("admin/pages/product/index", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    });
};
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công!"); // hiểu là tham số 1 là biến và tham số 2 là value
    res.redirect("back");
};
// [PATCH] /admin/products/change-multi/:status/:id
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", "); // chuyển về lại 1 mảng
    switch (type) {
        case "active":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "active" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
            );
            break;
        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "inactive" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
            );
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                {
                    deleted: "true",
                    deleteBy: {
                        account_id: res.locals.user.id,
                        deleteAt: new Date(),
                    },
                }
            );
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            req.flash(
                "success",
                `Đã đổi vị trí thành công ${ids.length} sản phẩm!`
            );
            break;
        default:
            break;
    }
    res.redirect("back");
};
// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne(
        { _id: id },
        {
            deleted: true,
            // deletedAt: new Date(),
            deleteBy: {
                account_id: res.locals.user.id,
                deleteAt: new Date(),
            },
        }
    );
    req.flash("success", `Đã xóa thành công sản phẩm!`);
    res.redirect("back");
};
// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };

    const category = await ProductCategory.find(find);
    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/product/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory,
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createBy = {
        account_id: res.locals.user.id,
    };

    // đoạn này để lưu dữ liệu vào database
    //đoạn này chỉ lưu ở model chứ chưa lưu vào database
    const product = new Product(req.body); // new Product nhận tham số là object, nhưng req.body nó cx trả ra object nên điền vậy
    await product.save(); // đoạn này mới lưu

    res.redirect(`${systemConfig.preFixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };
        const product = await Product.findOne(find);

        const category = await ProductCategory.find({
            deleted: false,
        });
        const newCategory = createTreeHelper.tree(category);
        res.render("admin/pages/product/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory,
        });
    } catch (error) {
        res.redirect(`${systemConfig.preFixAdmin}/products`);
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    try {
        await Product.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật ảnh thành công!");
    } catch (error) {
        req.flash("error", "Cập nhật Thất bại!");
    }

    res.redirect("back");
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };
        const product = await Product.findOne(find);

        console.log(product);
        res.render("admin/pages/product/detail", {
            pageTitle: product.title,
            product: product,
        });
    } catch (error) {
        res.redirect(`${systemConfig.preFixAdmin}/products`);
    }
};
