var router = require('express').Router();
var User = require('../models/user');
var passport = require('../lib/passport');
var activate = require('../lib/activate');
var debug = require('debug')('myapp-account'); // debug模块

router.route('/register')
    // 返回注册页面
    .get(function (req, res) {
        debug('/register');
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
        User.findOne({username: username}, function(err, user){
            if(err) {
                console.log("/account/register: error to search user",err);
                return next(err);
            }
            if(user) res.status(201).end('用户已存在');
            else{
                debug("going to save information of new user:" + username);
                user = {
                    username: username,
                    password: password
                };
                User.create( user, function(err, user, next){
                    if(err) return next(err);
                    activate.send(user);
                    res.send('已发送邮件至' + user.username + '，请在24小时内按照邮件提示激活。');
                }
            }
        });
    });

router.get('/active/:activeToken', function (req, res, next) {
    activate.check(req.params.activeToken, function(err, user){
        if(err){
            return res.render('message', {
                            title: '激活失败',
                            content: '您的激活链接无效，请重新 <a href="/account/signup">注册</a>'
                        });
        }
        if(user){
            res.render('message', {
                    title: '激活成功',
                    content: user.username + '已成功激活，请前往 <a href="/account/login">登录</a>'
                });
        }
    });
});

router.route('/login')
    .get(function (req, res) {
        res.render('login');
    })
    .post(passport.authenticate('local'),function (req, res, next) {
        var username = req.body.username,
            password = req.body.password;
        res.end('Login successfully');
    });
module.exports = router;
