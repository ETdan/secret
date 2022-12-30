require('dotenv').config();
const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const encrypt=require("mongoose-encryption");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine',"ejs");

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})
app.post("/register",(req,res)=>{

    const newUser =new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save((err)=>{
        if(!err)
            res.render("secrets");
        else    
            console.log(err);
    });
});

app.post("/login",(req,res)=>{
    const userName=req.body.username;
    const userPassword=req.body.password;
    User.findOne({email:userName},(err,found)=>{
       if(!err)
        {
            if(found)
                if(found.password===userPassword)
                    res.render("secrets");
                else
                    res.send("wrong password");
            else
                res.send("wrong Email");
        }
        else
            res.send("err")
    })
})

app.listen(3000,(req,res)=>{
    console.log("active at 3000");
})