var router = require('express').Router();
var User = require('../models/user');
var passport = require('../lib/passport');
var mailer = require('../lib/mailer');

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
                    //save username and password
                    console.log("going to save information of new user:", username);
                    User.create({username: username, password: password},
                        function(err, user) {
                            if (err) {
                                console.log("error to create user", err);
                                return next(err);    // 交给接下来的错误处理中间件
                            }
                            console.log("create user:", username, " successfully");
                            //res.status(201).end('注册成功');  
                            
                            // 生成20位激活码，`crypto`是nodejs内置的包
                            crypto.randomBytes(20, function (err, buf) {

                                // 保证激活码不会重复
                                user.activeToken = user._id buf.toString('hex');

                                // 设置过期时间为24小时
                                user.activeExpires = Date.now() + 24 * 3600 * 1000;
                                    var link = 'http://locolhost:3000/account/active/'
                                               + user.activeToken;

                                    // 发送激活邮件
                                    mailer.send({
                                        to: req.body.username,
                                        subject: '欢迎注册TMY博客',
                                        html: '请点击 <a href="' + link + '">此处</a> 激活。'
                                    });

                                    // 保存用户对象
                                    user.save(function(err, user){
                                        if(err) return next(err);
                                        res.send('已发送邮件至' + user.username + '，请在24小时内按照邮件提示激活。');
                                    });
                                });
                            });
                            //res.redirect('/');
                        });
                }
        });
    });

router.route('/login')
    .get(function (req, res) {
        res.render('login');
    })
    .post(passport('local'),function (req, res, next) {
        var username = req.body.username,
            password = req.body.password;
        res.end('Login successfully');
    });
module.exports = router;
