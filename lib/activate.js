var mailer = require('./mailer.js');
var User = require('../models/user');
var crypto = require('crypto');
var debug = require('debug')('myapp-activate'); 

var activate = {
    send: function(user, mynext){  
            // 生成20位激活码，`crypto`是nodejs内置的包
            // 有回调函数的时候是异步方法，注意！
            crypto.randomBytes(20, function (err, buf) {
                // 保证激活码不会重复
                user.activeToken = user._id + buf.toString('hex');
                
                // 设置过期时间为24小时
                user.activeExpires = Date.now() + 24 * 3600 * 1000;
                var link = 'http://localhost:3000/account/active/'
                            + user.activeToken;
                
                // 发送激活邮件
                mailer.send({
                    to: user.username,
                    subject: '欢迎注册TMY博客',
                    html: '请点击 <a href="' + link + '">此处</a> 激活。'
                        });
                mynext();
            });
        },
    check: function(token, next){
            // 找到激活码对应的用户
            User.findOne({
                activeToken: token,
                // 过期时间 > 当前时间
                activeExpires: {$gt: Date.now()}
            }, function (err, user) {
                if (err) return next(err);
                
                // 激活码无效
                if (!user) {
                    err = "invalid token";
                    return next(err, user);
                }

                if(user.active == true){
                    err = "already activated";
                    return next(err, user);
                }

                // 激活并保存
                user.active = true;
                user.save(function (err, user) {
                    if (err) return next(err);
                    next(err, user);  
                });
            });
    }
}

module.exports = activate;
