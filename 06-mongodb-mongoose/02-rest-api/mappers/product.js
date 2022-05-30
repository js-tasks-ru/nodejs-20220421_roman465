module.exports = function mapProduct(product) {
  return {
    id: product._id.toString(),
    title: product.title,
    images: product.images,
    category: product.category.toString(),
    subcategory: product.subcategory.toString(),
    price: product.price,
    description: product.description,
  };
};
