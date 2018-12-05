const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require("passport");
const app = new express();
// 引入接口router
const users = require("./routes/api/users");
const port = process.env.PORT || 5000;
// config
const db = require("./config/key").mongoURI;

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); 

app.use(passport.initialize());


// 使用中间件
app.use("/api/user",users);

// connect to mongose
mongoose.connect(db,{ useNewUrlParser: true })
        .then(()=>{
            console.log("MongoDB  connects");
        })
        .catch(err=>{
            console.log(err);
        })
        
require("./config/passport")(passport);   

app.get("/",(req,res) =>{
    res.send("Hello World!");
})

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})