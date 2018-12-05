//创建接口地址
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const keys = require('../../config/key');
const passport = require("passport");
router.get("/test",(req,res)=>{
    res.json("test is here");
})

//用户注册
router.post("/register",(req,res)=>{

    //查询数据中邮箱是否注册过
    User.findOne({email:req.body.email})
        .then(user=>{
            if(user){
                return res.status(400).json({email:'邮箱已经注册'})
            }
            else{

                const avator = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    email:req.body.email,
                    name:req.body.name,
                    avator,
                    password:req.body.password,
                })

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                               .then(user=>res.json(user))
                               .catch(err=>console.log(err));
                    });
                });
            }
        })
    
})

//用户登录
router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user=>{
            if(!user){
                return res.status(404).json({email:用户不存在});
            }
            //密码匹配
                bcrypt.compare(password,user.password)
                      .then(isMatch =>{
                          if(isMatch){
                            //设置token
                           // jwt.sign("规则",'加密名称','过期时间','拿token的回调函数')
                            const rule = {id:user.id,name:user.name}
                            jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                                if(err) throw err;
                                res.json({
                                    success:true,
                                    token:'Bearer '+ token
                                })
                            })
                          }else{
                              return res.status(400).json({password:'密码错误'});
                          }
                      })         
        })
})

//查询当前用户
router.get("/current",passport.authenticate('jwt',{session:false}),(req,res)=>{
    //res.json(req.user);
    res.json({
        id:req.user.id,
        email:req.user.email,
        name:req.user.name
    })

})

module.exports = router;