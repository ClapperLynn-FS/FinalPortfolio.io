"use strict";
let fs = require("fs");
let http = require("http");
let path = require("path");
let url = require("url");

let express = require("express");
let request = require("request");
let bodyParser= require("body-parser");



let ejs = require("ejs");
const router = express.Router();
let app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.engine("ejs",require("ejs").__express);

app.use(express.static("public"));
app.use(express.static("views"));

const session=require('express-session');
app.use(session({secret:"secret",saveUninitialized:true,resave:true}));
var sess;

router.get("/",function(req,res){
    sess=req.session;
    res.render("index",{pagename:"Home",sess:sess})
})

router.get("/contact",function(req,res){
    sess=req.session;
    res.render("contact",{pagename:"Contact",sess:sess})
})

router.get("/projects",function(req,res){
    sess=req.session;
    res.render("projects",{pagename:"Projects",sess:sess})
})

router.get("/profile",function(req,res){
    sess=req.session;
    if(typeof(sess)=="undefined" || sess.loggedin !=true){
        var errors = ["not a valid log in!"];
        res.render("index",{pagename:'Home',errors:error})
    }else{
        res.render("profile",{pagename:'profile',sess:sess})
    }
    
})

router.get("/logout",function(req,res){
    sess = req.session;
    sess.destroy(function(err){
        res.redirect("/")
    })


})
app.post("/login",function(req,res){
    let errors = []; 
    if(req.body.email == ""){
        errors.push("Email is Required!");
    }
    if(req.body.password == ""){
        errors.push("Password is Required!");
    }
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)){
        errors.push("Email is not valid!")
    }
    if(!/^[a-zA-Z]\W{3,14}$/.test(req.body.password)){
        errors.push("Password is not valid!")
    }
//set conditional to test user/pw
if(req.body.email=="Mike@aol.com" && req.body.password=="abc123"){
    sess=req.session;
    sess.loggedin= true;
    res.render('profile',{pagename:"Profile",sess:sess})
}else{
    sess=req.session;
    sess.loggedin= false;
    errors.push("Invalid Login Attempt!")
    res.render('index',{pagename:"Home",errors:errors})
}
    

console.log(errors);

})
app.post("/register",function(req,res){
    let errors = [];

//name validation
    if(req.body.name==""){
        errors.push("Name is Required!")
    }

//address validation
    if(req.body.address==""){
        errors.push("Address is Required!")
    }

//city validation
    if(req.body.city==""){
        errors.push("City is Required!")
    }

//state validation
    if(req.body.state==""){
        errors.push("State is Required!")
    }

//zipcode validation
    if(req.body.zipcode==""){
        errors.push("ZipCode is Required!")
    }

//age validation
    if(req.body.age==""){
        errors.push("Age is Required!")
    }

//gender validation
    if(req.body.gender==""){
        errors.push("gender is Required!")
    }

//consent box validation
    if(req.body.checked==""){
        errors.push("consent is Required!")
    }
    
    



    res.render("index",{pagename:"Home",errors:errors});
})

app.use("/",router)

let server = app.listen("0.0.0.0");