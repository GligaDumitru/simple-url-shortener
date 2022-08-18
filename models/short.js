const mongoose = require("mongoose");
const shortId = require("shortid");

const shortUrlSchema = new mongoose.Schema({
  fullName: {
    type: "string",
    required: true,
  },
  shortName: {
    type: "string",
    required: true,
    default: shortId.generate,
  },
  counts: {
    type: "number",
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
