var mailer = require('./mailer.js');
var User = require('../models/user');
var crypto = require('crypto');
var debug = require('debug')('myapp-activate'); 

 var activate = {
    send: function(req, res){  
            // 保存用户对象
            User.create({
                username: req.body.username,
                password: req.body.password
            },function(err, user){
                if(err) return next(err);
                // 生成20位激活码，`crypto`是nodejs内置的包
                crypto.randomBytes(20, function (err, buf) {

                    // 保证激活码不会重复
                    //debugger
                    user.activeToken = user._id + buf.toString('hex');
                    debug("activeToken:", user.activeToken);
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
                    res.send('已发送邮件至' + user.username + '，请在24小时内按照邮件提示激活。');
                });
            });
        },
    check: function(req, res){
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
    }
 }

module.exports = activate;