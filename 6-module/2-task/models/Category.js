const mongoose = require("mongoose");
const connection = require("../libs/connection");

const subCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform: function(doc, ret) {
        ret.id = doc._id;
        delete ret.__v;
        delete ret._id;
      }
    }
  }
);

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    subcategories: [subCategorySchema]
  },
  {
    toJSON: {
      transform: function(doc, ret) {
        ret.id = doc._id;
        delete ret.__v;
        delete ret._id;
      }
    }
  }
);

module.exports = connection.model("Category", categorySchema);
