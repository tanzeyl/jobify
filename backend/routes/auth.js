const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/multer");
const cloudinary = require("cloudinary").v2;
const { body, validationResult } = require("express-validator");
const router = express.Router();
const nodemailer = require("nodemailer");

const Company = require("../models/Company");
const Jobs = require("../models/Jobs");
const Student = require("../models/Student");
const TransactionsCompany = require("../models/TransactionsCompany");
const TransactionsStudent = require("../models/TransactionsStudent");

const fetchCompany = require("../middleware/fetchCompany");
const fetchUser = require("../middleware/fetchUser");

const JWT_STRING = process.env.REACT_APP_JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.REACT_APP_EMAIL,
    pass: process.env.REACT_APP_EMAIL_PASSWORD,
  },
});

cloudinary.config({
  cloud_name: "djptg7azn",
  api_key: "669116195862924",
  api_secret: "RWFuWEyB7yj5s8CcZxlBNwsNeFY",
});

// ROUTE 1: Create a company using POST => "/api/auth/createCompany". Does not require log in.
router.post(
  "/createCompany",
  [
    (body("password").notEmpty().isLength({ min: 8 }),
    body("email").notEmpty()),
  ],
  upload.single("image"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      let currentBalance = 200;
      //Hashing the password
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
      // Check if the email already exists.
      let company = await Company.findOne({
        email: req.body.email,
      });
      if (company) {
        return res.status(400).json({
          success: false,
          error: "A company with this email exists already! Kindly log-in.",
        });
      }
      if (req.body.name.length > 0) {
        currentBalance += 25;
      }
      if (req.body.websiteLink.length > 0) {
        currentBalance += 50;
      }
      if (req.body.teamSize.length > 0) {
        currentBalance += 20;
      }
      if (req.body.logo) {
        currentBalance += 50;
      }
      const { logo } = req.body;
      const uploadedImage = await cloudinary.uploader.upload(
        logo,
        {
          upload_preset: "vdl24evr",
          public_id: `${req.body.name} - avatar`,
          allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
        },
        function (error, result) {
          if (error) {
            console.log(error);
          }
        }
      );
      company = await Company.create({
        name: req.body.name,
        websiteLink: req.body.websiteLink,
        email: req.body.email,
        password: securePassword,
        teamSize: req.body.teamSize,
        logoLink: uploadedImage.secure_url,
        balance: currentBalance,
      });
      const transaction = await TransactionsCompany.create({
        company: company._id,
        type: "credit",
        amount: currentBalance,
        reason: "Sign-Up bonus.",
      });
      const data = {
        company: {
          id: company.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_STRING);
      res.json({ success: true, authtoken });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error.", err });
    }
  }
);

// ROUTE 2: Create a Job using POST => "/api/auth/createJob". Requires log-in.
router.post(
  "/createJob",
  fetchCompany,
  [
    body("roleName").notEmpty(),
    body("location").notEmpty(),
    body("minCTC").notEmpty(),
    body("maxCTC").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      let cost = 2 * req.body.roleName.length + 5 * req.body.location.length;
      let company = await Company.findById(req.company.id);
      let balance = company.balance - cost;
      if (balance >= 0) {
        company = await Company.findByIdAndUpdate(
          req.company.id,
          { $set: { balance } },
          { new: true }
        );
        const job = await Jobs.create({
          company: req.company.id,
          roleName: req.body.roleName,
          location: req.body.location,
          minCTC: req.body.minCTC,
          maxCTC: req.body.maxCTC,
        });
        const transaction = await TransactionsCompany.create({
          company: req.company.id,
          type: "debit",
          amount: cost,
          reason: `Posted a job with role name ${req.body.roleName}.`,
        });
        const mailOptions = {
          from: process.env.REACT_APP_EMAIL,
          to: company.email,
          subject: "New Job Successfully Posted at Jobify!!",
          text: `Congrats! You published a new job for ${req.body.roleName}.`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.status(500).send("Failed to send email.");
          } else {
            res.status(200).send("Email sent successfully");
          }
        });
        res.json({ success: true, message: "Job created successfully." });
      } else {
        res.json({ success: false, message: "Insufficient balance." });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

// ROUTE 3: Company log-in using POST => "/api/auth/companylogin". Does not require log-in.
router.post(
  "/companyLogin",
  [body("email").notEmpty(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      let company = await Company.findOne({ email });
      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Please try again with correct credentials.",
        });
      }
      const compare = await bcrypt.compare(password, company.password);
      if (!compare) {
        return res.status(400).json({
          success: false,
          message: "Please try again with correct credentials.",
        });
      }
      const data = {
        company: {
          id: company.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_STRING);
      res.json({ success: true, authtoken });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

// ROUTE 4: Student sign-up using POST => "/api/auth/studentSignup". Does not require log-in.
router.post(
  "/studentSignup",
  [body("email").notEmpty(), body("password").notEmpty()],
  async (req, res) => {
    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(req.body.password, salt);

    try {
      // Check if the email already exists.
      let student = await Student.findOne({
        email: req.body.email,
      });
      if (student) {
        return res.status(400).json({
          success: false,
          error: "A user with this email exists already! Kindly log-in.",
        });
      }
      student = await Student.create({
        email: req.body.email,
        password: securePassword,
      });
      const transaction = await TransactionsStudent.create({
        student: student._id,
        type: "credit",
        amount: 300,
        reason: `Sign-Up Bonus.`,
      });
      const data = {
        student: {
          id: student.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_STRING);
      res.json({ success: true, authtoken });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

// ROUTE 5: Student data upload using PUT => "/api/auth/addStudentDetails". Requires log-in.
router.put("/addStudentDetails", fetchUser, async (req, res) => {
  try {
    const { name, resumeLink, phone, pictureLink, location } = req.body;
    const user = await Student.findByIdAndUpdate(
      req.user.id,
      {
        $set: { name, resumeLink, phone, pictureLink, location },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "User details successfully updated." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ROUTE 6: User log-in using POST => "/api/auth/userlogin". Does not require log-in.
router.post(
  "/studentLogin",
  [body("email").notEmpty(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      let student = await Student.findOne({ email });
      if (!student) {
        return res.status(400).json({
          success: false,
          message: "Please try again with correct credentials.",
        });
      }
      const compare = await bcrypt.compare(password, student.password);
      if (!compare) {
        return res.status(400).json({
          success: false,
          message: "Please try again with correct credentials.",
        });
      }
      const data = {
        student: {
          id: student.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_STRING);
      res.json({ success: true, authtoken });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

// ROUTE 7: Fetch all jobs using GET. => "/api/auth/viewJobs". Requires log-in.
router.get("/viewJobs", fetchUser, async (req, res) => {
  try {
    let jobs = await Jobs.find();
    res.status(200).json({ success: true, jobs: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ROUTE 8: Post for a job using GET. => "/api/auth/apply:id". Requires log-in.
router.get("/apply/:id", fetchUser, async (req, res) => {
  try {
    let job = await Jobs.findById(req.params.id);
    let student = await Student.findById(req.user.id);
    let rr = 2 * job.roleName.length + 5 * job.location.length;
    let balance = student.balance;
    if (balance >= 0) {
      if (job.applicants.includes(req.user.id)) {
        res.status(400).json({
          success: false,
          message: "You have already applied for this job.",
        });
      }
      let applicants = job.applicants;
      job = await Jobs.findByIdAndUpdate(
        req.params.id,
        { $set: { applicants } },
        { new: true }
      );
      balance = balance - rr + rr / 5;
      let appliedJobs = student.appliedJobs;
      appliedJobs.push(req.params.id);
      student = await Student.findByIdAndUpdate(
        req.user.id,
        { $set: { balance, appliedJobs } },
        { new: true }
      );
      let transaction = await TransactionsStudent.create({
        student: req.user.id,
        type: "debit",
        amount: rr,
        reason: `Applied for a job with role name ${job.roleName}`,
      });
      transaction = await TransactionsStudent.create({
        student: req.user.id,
        type: "credit",
        amount: rr / 5,
        reason: `Cashback for applying for a job with role name ${job.roleName}`,
      });
      let company = await Company.findById(job.company);
      balance = company.balance + 0.5 * rr;
      company = await Company.findByIdAndUpdate(
        job.company,
        { $set: { balance } },
        { new: true }
      );
      transaction = await TransactionsCompany.create({
        company: job.company,
        type: "credit",
        amount: 0.5 * rr,
        reason: `Cashback as ${student.email} applied to the job with the role name ${job.roleName}`,
      });
      const mailOptions = {
        from: process.env.REACT_APP_EMAIL,
        to: company.email,
        subject: "New applicant alert",
        text: `${student.email} applied for the role of ${job.roleName}.`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send("Failed to send OTP");
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).send("OTP sent successfully");
        }
      });
      res.status(200).json({ success: true, message: "Successfully applied." });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Insufficient balance." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ROUTE 9: Get all transactions details of a company using GET. => "/api/auth/transactions". Requires log-in.
router.get("/transactions", fetchCompany, async (req, res) => {
  try {
    const transactions = await TransactionsCompany.find({
      company: req.company.id,
    });
    res.status(200).json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ROUTE 9: Get all transactions details of a company using GET. => "/api/auth/transactions". Requires log-in.
router.get("/paymentHistory", fetchUser, async (req, res) => {
  try {
    const transactions = await TransactionsStudent.find({
      student: req.user.id,
    });
    res.status(200).json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ROUTE 10: Get all details of a company using GET. => "/api/auth/companyProfile". Requires log-in.
router.get("/companyProfile", fetchCompany, async (req, res) => {
  try {
    const company = await Company.findById(req.company.id);
    if (!company) {
      res.status(404).json({ success: false, message: "Invalid credentials." });
    }
    res.status(200).json({ success: true, company });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ROUTE 11: Update details of a company using POST. => "/api/auth/updateCompanyDetails". Requires log-in.
router.post(
  "/updateCompanyDetails",
  upload.single("image"),
  fetchCompany,
  async (req, res) => {
    try {
      const { name, websiteLink, email, teamSize } = req.body;
      let newDetails = {};
      if (name) newDetails.name = name;
      if (websiteLink) newDetails.websiteLink = websiteLink;
      if (email) newDetails.email = email;
      if (teamSize) newDetails.teamSize = teamSize;
      let company = await Company.findById(req.company.id);
      if (!company) {
        res
          .status(404)
          .json({ success: false, message: "Invalid credentials." });
      }
      const { logo } = req.body;
      if (logo) {
        const uploadedImage = await cloudinary.uploader.upload(
          logo,
          {
            upload_preset: "vdl24evr",
            public_id: `${req.body.name} - avatar`,
            allowed_formats: [
              "png",
              "jpg",
              "jpeg",
              "svg",
              "ico",
              "jfif",
              "webp",
            ],
          },
          function (error, result) {
            if (error) {
              console.log(error);
            }
          }
        );
        newDetails.logoLink = uploadedImage.secure_url;
      }
      company = await Company.findByIdAndUpdate(
        req.company.id,
        { $set: newDetails },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Company details updated.",
        details: newDetails,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

module.exports = router;
