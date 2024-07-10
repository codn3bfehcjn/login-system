const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const db = require("./db"); 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.set("view engine", "ejs");

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    let existingUser = await db.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    let hash = await bcrypt.hash(password, 10);
    let newUser = new db({ username, password: hash });
    await newUser.save();
    res.render("home");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Both username and password are required to log in.");
  }

  try {
    let loggedUser = await db.findOne({ username });
    if (!loggedUser) {
      return res.status(400).send("Incorrect username");
    }

    let passwordMatch = await bcrypt.compare(password, loggedUser.password);
    if (!passwordMatch) {
      return res.status(400).send("Incorrect password");
    }

    res.render("home");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/logout', (req, res) => {
  res.redirect('/login');
});

app.listen(3000, "127.0.0.1", () => {
  console.log("Server is running at http://127.0.0.1:3000/");
});
