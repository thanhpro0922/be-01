const ProductCategory = require("../../model/product-category.model");
const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
    const records = await ProductCategory.find({
        deleted: false,
    });

    const newProductsCategory = createTreeHelper.tree(records);

    res.locals.layoutProductsCategory = newProductsCategory;
    next();
};
