const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const path = require("path");
const cookieParser = require("cookie-parser");
const User = require("./models/usermodel");
const jwt = require("jsonwebtoken");
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/create", (req, res) => {
  const { username, email, password } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const user = await User.create({
        username,
        email,
        password: hash,
      });
      let token = jwt.sign({ email }, "ahsan");
      res.cookie("token", token);
      res.render("login");
    });
  });
});
app.post("/logout", (req, res) => {
  res.cookie("token", "");
});
app.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("somthing went wrong");
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email: req.body.email }, "ahsan");
      res.cookie("token", token).send("you can login");
    } else {
      res.send("something went wrong");
    }
  });
});

app.listen(3000, () => console.log("listening on port 3000"));
