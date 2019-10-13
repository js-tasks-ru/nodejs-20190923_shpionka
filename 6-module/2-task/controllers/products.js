const Product = require("../models/Product");
const mongoose = require("mongoose");

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const subcategoryId = ctx.request.query.subcategory;
  const products = await Product.find({ subcategory: subcategoryId });
  ctx.body = { products: products };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.body = { products: products };
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId))
    ctx.throw(400, "id is invalid");

  const product = await Product.findById(productId);

  if (product === null || product === undefined) {
    ctx.throw(404, "id doesn't exist");
  }

  ctx.body = { product: product };
};
