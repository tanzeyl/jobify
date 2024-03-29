const mongoose = require("mongoose");
const mongoURI = process.env.REACT_APP_DB_STRING;

const connectToMongoDB = () => {
  mongoose.connect(mongoURI);
};

module.exports = connectToMongoDB;
