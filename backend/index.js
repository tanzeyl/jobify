require("dotenv").config();
const connectToMongoDB = require("./db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

connectToMongoDB();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
const port = 5000;
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors(corsOptions));
app.use(bodyParser.json());

//Available Routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Jobify Backend listening on port http://localhost:${port}`);
});
