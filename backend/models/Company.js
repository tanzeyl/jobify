const mongoose = require("mongoose");
const { Schema } = mongoose;

const CompanySchema = new Schema({
  name: {
    type: String,
  },

  websiteLink: {
    type: String,
    unique: true,
  },

  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  teamSize: {
    type: String,
  },

  logoLink: {
    type: String,
  },

  balance: {
    type: Number,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model("company", CompanySchema);
module.exports = Company;
