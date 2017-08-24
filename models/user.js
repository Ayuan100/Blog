var mongoose = require('mongoose');
var debug = require('debug')('myapp-mongoose user');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String, 
        index: {unique: true}
    },
    password: String,
    avatar: {
        type: String,
        default: '/images/default-avatar.jpg'
    },
    title: {
        type: String,
        default: 'none'
    },
    description: {
        type: String,
        default: 'empty'
    },
    activeToken: String,
    activeExpires: String,
    active: {
        type: Boolean,
        default: false
    }
});

var passportLocalMongoose = require('passport-local-mongoose');

UserSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model('User', UserSchema);