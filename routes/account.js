var router = require('express').Router();

var User = require('../models/user');



router.route('/register')
    // 返回注册页面
    .get(function (req, res) {
        res.render('register', {title: 'Register'});
    })
    // 接受用户表单
    .post(function (req, res, next) {
        var username = req.body.username || '',
            password = req.body.password || '';

        if(username.length === 0 || password.length === 0){
            return res.status(400).end('用户名或密码不合法'); 
        }

        User.findOne({username: username}, 
            function(err, user){
                if(err) {
                    console.log("error to search user",err);
                    return next(err);
                }
                if(user) res.status(201).end('用户已存在');
                else{
                    console.log("going to save information of new user:", username);
                    User.create({username: username, password: password},
                        function(err, user) {
                            if (err) {
                                console.log("error to create user", err);
                                return next(err);    // 交给接下来的错误处理中间件
                            }
                            console.log("create user:", username, " successfully");
                            //res.status(201).end('注册成功');       // 存储成功
                            res.redirect('/');
                        });
                }
        });

        // 将来会在这里检查用户名是否存在，我们先把它设为true
        //var usernameExist = true;
        
        //if(usernameExist){
          //  return res.status(400).end('用户名已存在');
        //}
        
        // 将来会在这里执行用户、密码的存储
        
        //res.status(201).end('注册成功');
    });

router.route('/login')
    .get(function (req, res) {
        res.render('login');
    })
    .post(function (req, res, next) {
        var username = req.body.username,
            password = req.body.password;

        res.end('Login successfully');
    });
module.exports = router;