const jwt = require("jsonwebtoken");
const JWT_STRING = process.env.REACT_APP_JWT_SECRET;

const fetchCompany = (req, res, next) => {
  // Get User details and append id to request.
  const token = req.header("auth-token");
  if (!token) {
    res
      .status(401)
      .json({ error: "Please authenticate using valid credentials." });
  }
  try {
    const data = jwt.verify(token, JWT_STRING);
    req.company = data.company;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ error: "Please authenticate using valid credentials." });
  }
};

module.exports = fetchCompany;
