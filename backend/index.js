require("dotenv").config();
const connectToMongoDB = require("./db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
connectToMongoDB();

const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//Available Routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`CloudBooks Backend listening on port http://localhost:${port}`);
});
