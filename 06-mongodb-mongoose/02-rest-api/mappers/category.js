module.exports = function mapCategory(category) {
  return {
    id: category._id.toString(),
    title: category.title,
    subcategories: category.subcategories.map((subcategory) => ({
      id: subcategory._id.toString(),
      title: subcategory.title,
    })),
  };
};
