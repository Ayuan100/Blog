var router = require('express').Router();
var User = require('../models/user');
var passport = require('../lib/passport');
var mailer = require('../lib/mailer');
var debug = require('debug')('my-application'); // debug模块

router.route('/register')
    // 返回注册页面
    .get(function (req, res) {
        res.render('register', {title: 'Register'});
    })
    // 接受用户表单
    .post(function (req, res, next) {
        var username = req.body.username || '',
            password = req.body.password || '';
        //check if is ilegal
        if(username.length === 0 || password.length === 0){
            return res.status(400).end('用户名或密码不合法'); 
        }
        //check if user exists
        User.findOne({username: username}, 
            function(err, user){
                if(err) {
                    console.log("error to search user",err);
                    return next(err);
                }
                if(user) res.status(201).end('用户已存在');
                else{
                    //save username and password
                    debug("going to save information of new user:" + username);
                    User.create({username: username, password: password},
                        function(err, user) {
                            if (err) {
                                console.log("error to create user", err);
                                return next(err);    // 交给接下来的错误处理中间件
                            }
                        
                            debug("create user:", username, " successfully");
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

router.get('/active/:activeToken', function (req, res, next) {

    // 找到激活码对应的用户
    User.findOne({
        activeToken: req.params.activeToken,
        
        // 过期时间 > 当前时间
        activeExpires: {$gt: Date.now()}
    }, function (err, user) {
        if (err) return next(err);
        
        // 激活码无效
        if (!user) {
            return res.render('message', {
                title: '激活失败',
                content: '您的激活链接无效，请重新 <a href="/account/signup">注册</a>'
            });
        }

        // 激活并保存
        user.active = true;
        user.save(function (err, user) {
            if (err) return next(err);

            // 返回成功
            res.render('message', {
                title: '激活成功',
                content: user.username + '已成功激活，请前往 <a href="/account/login">登录</a>'
            })
        });
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
