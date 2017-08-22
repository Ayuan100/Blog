var router = require('express').Router();

var User = require('../models/user');


var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
//setup strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

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
                            //res.status(201).end('注册成功');       // 存储成功
                            res.redirect('/');
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
