const mongoose = require("mongoose");
const { Schema } = mongoose;

const JobsSchema = new Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },

  roleName: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  minCTC: {
    type: String,
    required: true,
  },

  maxCTC: {
    type: String,
    require: true,
  },

  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("jobs", JobsSchema);
module.exports = Job;
