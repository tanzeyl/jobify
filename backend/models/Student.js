const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentSchema = new Schema({
  name: {
    type: String,
    default: "",
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    require: true,
  },

  resumeLink: {
    type: String,
    default: "",
  },

  phone: {
    type: String,
    default: "",
  },

  pictureLink: {
    type: String,
    default: "",
  },

  location: {
    type: String,
    default: "",
  },

  balance: {
    type: Number,
    default: 300,
  },

  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "jobs" }],

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Student = mongoose.model("student", StudentSchema);
module.exports = Student;
