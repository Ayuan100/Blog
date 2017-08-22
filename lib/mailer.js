var _ = require('lodash');	
var nodemailer = require('nodemailer');

var config = {
    host: 'smtp.126.com',
    port: 25,
    auth: {
        user: 'xxx@126.com',
        pass: '你的密码'
    }
};
    
var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: 'TMY Blog <xxx@126.com>',
    text: 'test text',
};

module.exports = {
    send: function(mail){
            // 应用默认配置
            mail = _.merge({}, defaultMail, mail);
            
            // 发送邮件
            transporter.sendMail(mail, function(error, info){
                if(error) return console.log(error);
                console.log('mail sent:', info.response);
            });
        }
};
