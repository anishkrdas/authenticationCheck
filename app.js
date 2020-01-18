//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));

const mongoURL = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB_NAME;

mongoose.connect(mongoURL + dbName, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

//const secret = ;
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/register",function(req, res){
  res.render("register");
});

app.route("/register")
.get(function(req, res){
  res.render("register");
})
.post(function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  const newUser = new User({user: userName, password: password});
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  });
});

app.route("/login")
.get(function(req, res){
  res.render("login");
})
.post(function(req,res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({user: userName}, function(err, userFound){
    if(err){
      console.log(err);
    }
    else if(userFound && userFound.password === password){
      res.render("secrets");
    }
    else{
      res.render("login");
    }
  });
});

app.listen(3000, function(){
  console.log("Server has been successfully started on port 3000!");
});
