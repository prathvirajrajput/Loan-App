const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/loan-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
});

const loanSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  term: Number,
  startDate: Date,
  state: { type: String, default: "PENDING" },
});

const repaymentSchema = new mongoose.Schema({
  loanId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  dueDate: Date,
  state: { type: String, default: "PENDING" },
});

const User = mongoose.model("User", userSchema);
const Loan = mongoose.model("Loan", loanSchema);
const Repayment = mongoose.model("Repayment", repaymentSchema);



// Routes here

// User registration
app.post("/register", async (req, res) => {
  const { username, password, isAdmin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, isAdmin });
  await user.save();
  res.send("User registered");
});

// User login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid credentials");
  }
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "secret", {
    expiresIn: "1h",
  });

  res.send({ token, user });
});

// Middleware to authenticate and set req.user
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer", "");
  console.log("token recived", token);
  if (!token) {
    console.log("a1");
    return res.status(401).send({ error: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token.trim(), "secret");
    // console.log(decoded)
    req.user = decoded;
    next();
  } catch (e) {
    console.log("a2", e);

    res.status(401).send({ error: "Invalid token" });
  }
};
app.use(authMiddleware);

// Create a loan
app.post("/loans", authMiddleware, async (req, res) => {
  const { amount, term } = req.body;
  try {
    const loan = new Loan({
      userId: req.user.id,
      amount,
      term,
      startDate: new Date(),
    });
    await loan.save();
    const repayments = [];
    for (let i = 1; i <= term; i++) {
      const repayment = new Repayment({
        loanId: loan._id,
        amount: (amount / term).toFixed(2),
        dueDate: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000), // weekly interval
      });
      repayments.push(repayment);
    }
    await Repayment.insertMany(repayments);
    res.send(loan);
  } catch (error) {
    console.log("error creating loan", error);
    res.status(500).send("server error");
  }
});

// Approve a loan

app.get("/loans/pending", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).send("Access denied.");
  }

  try {
    const pendingLoans = await Loan.find({ state: "PENDING" });
    res.send(pendingLoans);
  } catch (error) {
    console.error("Error fetching pending loans:", error);
    res.status(500).send("Server error");
  }
});

app.post("/loans/:id/approve", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).send("Not authorized");
  }
  const loan = await Loan.findById(req.params.id);
  loan.state = "APPROVED";
  await loan.save();
  res.send(loan);
});

// View user's loans
app.get("/loans", async (req, res) => {
  const loans = await Loan.find({ userId: req.user.id });
  res.send(loans);
});

// Add a repayment
app.post("/repayments", async (req, res) => {
  const { loanId, amount } = req.body;
  const repayment = await Repayment.findOne({ loanId, state: "PENDING" }).sort(
    "dueDate"
  );

  if (!repayment) {
    return res.status(400).send("No pending repayments");
  }
  if (amount < repayment.amount) {
    return res.status(400).send("Insufficient amount");
  }
  repayment.state = "PAID";
  await repayment.save();
  const pendingRepayments = await Repayment.find({ loanId, state: "PENDING" });
  if (pendingRepayments.length === 0) {
    const loan = await Loan.findById(loanId);
    loan.state = "PAID";
    await loan.save();
  }
  res.send(repayment);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
