const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});
categorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model("categoryEntity", categorySchema, "categories");
