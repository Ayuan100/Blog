module.exports = function(req,res,next){
    if(req.user && req.user.active) return next();
    return res.redirect('/account/login?next=' + req.originalUrl);
};
