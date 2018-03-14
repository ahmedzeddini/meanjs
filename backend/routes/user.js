var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/database');


       
   
router.post('/createUser',(req,res,next)=>{
    var newUser = new User({
        username:req.body.username,
        password:req.body.password
    });
    newUser.save((err,user)=>{
        if(err)
         res.status(500).json({errmsg: err});
         res.status(200).json({ msg: user });

    });
}); 



router.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username: username, password: password}, function(err,user){
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        if(!user){
            console.log(err);
            if(!user) return res.json({success: false, msg: 'User not found!'});
        }
        
        const token = jwt.sign({data: user}, config.secret, {
            expiresIn: 604800 // 1 week
        });
        
        res.json({ 
            success: true, 
            token: `Bearer ${token}`,
            user: {
                id: user._id
            }
        });
  });
});

// Profile Page - 


router.get('/user',(req,res,next)=>{
    User.find({},(err, user)=>{
        if(err)
        res.status(500).json({errmsg: err});
        res.status(200).json({ msg: user });

       });
});



router.put('/updateUser',(req,res,next)=>{
    User.findById(req.body._id,(err,user)=>{
        if(err)
         res.status(500).json({errmsg:err});
         user.username=req.body.username;
         user.password=req.body.password;
         user.save((err,user)=>{
            if(err)
            res.status(500).json({errmsg: err});
            res.status(200).json({ msg: user });
         });
    });
});







module.exports = router;

