const ProductCategory = require("../../model/product-category.model");

const systemConfig = require("../../config/system");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await ProductCategory.find(find);

    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh sách sản phẩm",
        records: records,
    });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/product-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
    });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.preFixAdmin}/products-category`);
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, { status: status });
    // await Product.updateOne({ _id: id }, { status: status });
    // req.flash("success", "Cập nhật trạng thái thành công!"); // hiểu là tham số 1 là biến và tham số 2 là value
    // res.redirect("back");
    res.redirect("back");
};

// [PATCH] /admin/products-category/change-multi/:status/:id
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", "); // chuyển về lại 1 mảng
    switch (type) {
        case "active":
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { status: "active" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
            );
            break;
        case "inactive":
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { status: "inactive" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
            );
            break;
        case "delete-all":
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { deleted: "true", deletedAt: new Date() }
            );
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await ProductCategory.updateOne({ _id: id }, { position: position });
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
