const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/multer");
const cloudinary = require("cloudinary").v2;
const { body, validationResult } = require("express-validator");
const router = express.Router();
const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_KEY);

const Company = require("../models/Company");
const Jobs = require("../models/Jobs");
const Student = require("../models/Student");
const TransactionsCompany = require("../models/TransactionsCompany");
const TransactionsStudent = require("../models/TransactionsStudent");

const fetchCompany = require("../middleware/fetchCompany");
const fetchUser = require("../middleware/fetchUser");
const Job = require("../models/Jobs");

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
    body("duration").notEmpty(),
    body("openings").notEmpty(),
    body("startDate").notEmpty(),
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
          duration: req.body.duration,
          openings: req.body.openings,
          startDate: req.body.startDate,
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
  [
    body("name").notEmpty(),
    body("email").notEmpty(),
    body("password").notEmpty(),
    body("phone").notEmpty(),
    body("location").notEmpty(),
  ],
  upload.single("image"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      //Hashing the password
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
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

      const { picture } = req.body;
      const uploadedImage = await cloudinary.uploader.upload(
        picture,
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

      const { resume } = req.body;
      const uploadedResume = await cloudinary.uploader.upload(
        resume,
        {
          upload_preset: "vdl24evr",
          public_id: `${req.body.name} - Resume`,
          allowed_formats: ["pdf", "docx"],
        },
        function (error, result) {
          if (error) {
            console.log(error);
          }
        }
      );

      student = await Student.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
        resumeLink: uploadedResume.secure_url,
        phone: req.body.phone,
        pictureLink: uploadedImage.secure_url,
        location: req.body.location,
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
router.post(
  "/addStudentDetails",
  upload.single("image"),
  fetchUser,
  async (req, res) => {
    try {
      const { name, email, phone, location } = req.body;

      let newDetails = {};
      if (name) newDetails.name = name;
      if (email) newDetails.email = email;
      if (phone) newDetails.phone = phone;
      if (location) newDetails.location = location;

      let student = await Student.findById(req.user.id);

      if (!student) {
        res
          .status(404)
          .json({ success: false, message: "Invalid credentials." });
      }

      const { resume } = req.body;

      if (resume) {
        const uploadedResume = await cloudinary.uploader.upload(
          resume,
          {
            upload_preset: "vdl24evr",
            public_id: `${req.body.name} - Resume`,
            allowed_formats: ["pdf", "docx"],
          },
          function (error, result) {
            if (error) {
              console.log(error);
            }
          }
        );
        newDetails.resumeLink = uploadedResume.secure_url;
      }

      const { profile } = req.body;

      if (profile) {
        const uploadedImage = await cloudinary.uploader.upload(
          profile,
          {
            upload_preset: "vdl24evr",
            public_id: `${req.body.name} - Avatar`,
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
        newDetails.pictureLink = uploadedImage.secure_url;
      }

      student = await Student.findByIdAndUpdate(
        req.user.id,
        { $set: newDetails },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Company details updated.",
        details: student,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

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
    let jobs = await Jobs.find().populate("company");
    res.status(200).json({ success: true, jobs });
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
        return res.status(400).json({
          success: false,
          message: "You have already applied for this job.",
        });
      }
      let applicants = job.applicants;
      applicants.push(req.user.id);
      job = await Jobs.findByIdAndUpdate(
        req.params.id,
        { $set: { applicants } },
        { new: true }
      );
      balance = balance - rr + rr / 5;
      let appliedJobs = student.appliedJobs;
      if (appliedJobs.some((obj) => obj["jobId"] === req.params.id)) {
        console.log("HELLO");
      }
      appliedJobs.push({ jobId: req.params.id, status: "applied" });
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

// ROUTE 9: Get all transactions details of a student using GET. => "/api/auth/transactions". Requires log-in.
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

// ROUTE 12: View all posted jobs using GET. => "/api/auth/allPostedJobs". Requires log-in.
router.get("/allPostedJobs", fetchCompany, async (req, res) => {
  try {
    const jobs = await Jobs.find({ company: req.company.id });
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ROUTE 12: Get applicant details using POST. => "/api/auth/getApplicantDetails". Requires log-in.
router.post("/getApplicantDetails", fetchCompany, async (req, res) => {
  try {
    const student = await Student.findById(req.body.studentId).select(
      "-password"
    );
    res.status(200).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ROUTE 13: Get student details using GET. => "/api/auth/getStudentDetails". Requires log-in.
router.get("/getStudentDetails", fetchUser, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ROUTE 14: Get all applied jobs of a student using GET. => "/api/auth/appliedJobs". Requires log-in.
router.get("/appliedJobs", fetchUser, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    const appliedJobs = student.appliedJobs;
    const jobs = [];
    for (let i = 0; i < appliedJobs.length; i++) {
      let job = await Jobs.findById(appliedJobs[i].jobId).select("-applicants");
      job.status = appliedJobs[i];
      jobs.push(job);
    }
    res
      .status(200)
      .json({ success: true, appliedJobs: jobs, status: appliedJobs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ROUTE 15: Change application status of a student using POST. => "/api/auth/changeStatus". Requires log-in.
router.post(
  "/changeStatus",
  fetchCompany,
  [body("status").notEmpty(), body("id").notEmpty(), body("jobId").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      let student = await Student.findById(req.body.id);
      const job = await Job.findById(req.body.jobId);
      let appliedJobs = student.appliedJobs;
      for (let i = 0; i < appliedJobs.length; i++) {
        if (appliedJobs[i].jobId.toString() === req.body.jobId.toString()) {
          appliedJobs[i].status = req.body.status + "ed";
          student.appliedJobs = appliedJobs;
          student = await student.save();
          const mailOptions = {
            from: process.env.REACT_APP_EMAIL,
            to: student.email,
            subject: "Job Status Update!",
            text: `Your job status has been updated for the role of ${job.roleName}.`,
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent.");
            }
          });
          return res
            .status(200)
            .json({ success: true, message: "Status updated successfully." });
        }
      }
      return res
        .status(401)
        .json({ success: false, message: "Some error occured." });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

// ROUTE 16: Make user payments using POST. => /api/auth/userPayment. Requires log-in.
router.post("/userPayment", fetchUser, async (req, res) => {
  const { amount, currency, paymentMethodId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.REACT_APP_FRONTEND_URL}/studentProfile`,
    });
    const transaction = await TransactionsStudent.create({
      student: req.user.id,
      type: "credit",
      amount: amount,
      reason: `Completed a payment of Rs. ${amount}/-.`,
    });
    let student = await Student.findById(req.user.id);
    let balance = parseInt(student.balance);
    balance = balance + parseInt(amount);
    student.balance = balance;
    student.save();
    return res.json({
      success: true,
      message: "Payment successful",
      paymentIntent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

// ROUTE 16: Make user payments using POST. => /api/auth/userPayment. Requires log-in.
router.post("/companyPayment", fetchCompany, async (req, res) => {
  const { amount, currency, paymentMethodId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.REACT_APP_FRONTEND_URL}/studentProfile`,
    });
    const transaction = await TransactionsCompany.create({
      company: req.company.id,
      type: "credit",
      amount: amount,
      reason: `Completed a payment of Rs. ${amount}/-.`,
    });
    let company = await Company.findById(req.company.id);
    let balance = parseInt(company.balance);
    balance = balance + parseInt(amount);
    company.balance = balance;
    company.save();
    return res.json({
      success: true,
      message: "Payment successful",
      paymentIntent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

module.exports = router;
