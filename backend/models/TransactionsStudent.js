const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionsStudentSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },

  type: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const TransactionsStudent = mongoose.model(
  "transactionsstudent",
  TransactionsStudentSchema
);
module.exports = TransactionsStudent;
