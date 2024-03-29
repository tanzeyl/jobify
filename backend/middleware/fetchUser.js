const jwt = require("jsonwebtoken");
const JWT_STRING = process.env.REACT_APP_JWT_SECRET;

const fetchUser = (req, res, next) => {
  // Get User details and append id to request.
  const token = req.header("authtoken");
  if (!token) {
    res
      .status(401)
      .json({ error: "Please authenticate using valid credentials." });
  }
  try {
    const data = jwt.verify(token, JWT_STRING);
    req.user = data.student;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ error: "Please authenticate using valid credentials." });
  }
};

module.exports = fetchUser;
