var _ = require('lodash');	
var nodemailer = require('nodemailer');
var debug = require('debug')('myapp-mailer'); 

var config = {
    host: 'smtp.126.com',
    port: 25,
    auth: {
        user: 'ayuan_test@126.com',
        pass: 'Ayuan100'
    }
};
    
var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: 'My Blog <ayuan_test@126.com>',
    text: 'test text',
};

module.exports = {
    send: function(mail){
            // 应用默认配置
            mail = _.merge({}, defaultMail, mail);

            // 发送邮件
            transporter.sendMail(mail, function(error, info){
                if(error) return console.log(error);
                debug('mail sent:', info.response);
            });
        }
};
