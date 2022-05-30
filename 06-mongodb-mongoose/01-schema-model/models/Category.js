const mongoose = require('mongoose');
const connection = require('../libs/connection');
const subCategory = require('../models/SubCategory');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subcategories: [subCategory.schema],
});

module.exports = connection.model('Category', categorySchema);
