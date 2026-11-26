require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./User");
const protect = require("./middleware/auth")
const Transaction = require("./Transaction");

const app = express();

app.use(cors());
app.use(express.json());


app.post("/auth/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All field are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `An account with this email already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname: fullName,
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});

    res.status(200).json({
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid login credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid login credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.delete("/delete-user/:id", async(req, res) => {
//   try{
//     const {id} = req.params
//     const user = await User.findByIdAndDelete(id)

//     if(!user){
//       return res.status(400).json({message: "User not found"})
//     }
//     res.status(200).json({message: "User acount deleted successfully", user})

//   }catch(error){
//     res.status(500).json({ error: error.message });
//   }
// })

app.delete("/users/me", protect, async (req, res) => {
  try {
    await Transaction.deleteMany({ userId: req.userId }); 
     const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
    return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Your account has been deleted successfully." });
  } catch (error) {
    res.status(500).json({message: "Something went wrong" });
  }
});

app.put("/change-password", protect, async (req, res) => {
  try {
    const {currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All field are required" });
    }

    const user = await User.findById(req.userId).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({
      message: "Password updated",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/transaction", protect, async (req, res) => {
  try {
    const {amount, description, category, date, type} = req.body

    if(!amount || !description || !category || !type ||!date){
          return res.status(400).json({ message: "All fields are required" });
    }
    const transaction = await Transaction.create({
        userId: req.userId,
        amount, 
        type,
        category,
        description,
        date: new Date()
    })
    res.status(200).json({message: "Transaction added successfully", transaction})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/transactions", protect, async(req, res) => {
    try{
        const transactions = await Transaction.find({userId: req.userId})
        .sort({ date: -1, createdAt: -1 });

        if(!transactions){
          return  res.status(400).json({message: "No transactions yet!"})
        }

        res.status(200).json(transactions)

    }catch(error){
       res.status(500).json({ error: error.message }); 
    }
})

app.delete("/delete-transaction/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findByIdAndDelete(id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({
            message: "Transaction deleted successfully",
            transaction,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT;

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
});
