const mongoose = require('mongoose');
const connection = require('../libs/connection');
// const category = require('../models/Category');
const subCategory = require('../models/SubCategory');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true,
  },
  images: [String],
});

module.exports = connection.model('Product', productSchema);
