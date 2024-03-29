const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionsCompanySchema = new Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
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

const TransactionsCompany = mongoose.model(
  "transactionscompany",
  TransactionsCompanySchema
);
module.exports = TransactionsCompany;
