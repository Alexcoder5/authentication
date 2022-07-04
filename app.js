//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect(
  'mongodb+srv://AlexCoder:DkffpseQQdg08puQ@mycluster.jrp6f.mongodb.net/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const userSchema = new mongoose.Schema({  // !!propper schema for the encryption
  email: String,
  password: String
});


userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password']   // mongoose-encryption encrypt when you save and decrypt when you find
});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const newUser = User({
    email: username,
    password: password
  });

  newUser.save((err) => {
    if (!err) {
      res.render('secrets');
    } else {
      console.log(err);
    }
  });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username,
  }, (err, found) => {
    if (err) {
      console.log(err);
    } else {
      if (found) {
        if (found.password === password) {
          res.render('secrets');
        }
      }
    }
  });
});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
