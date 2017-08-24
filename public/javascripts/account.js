function signup(){
    if(!simpleValidate()) return;

    var password = $('[name=password]').val();
    var password1 = $('#password1').val();
    if(password != password1){
        warn('两次输入的密码不一致');
        return;
    }
    $.post('/account/register', $('form').serialize())
        .done(function(res){
            warn(res);
        })
        .fail(function(res){
            warn(res);
        });
}

function login(){
    if(!simpleValidate()) return;
    $.post('/account/login', $('form').serialize())
        .done(function(res){
            alert('done');
            redirect('/home');
        })
        .fail(function(res){
            alert('fail');
            warn(res);
        });
}

function simpleValidate(){
    var username = $('[name=username]').val().trim();
    var password = $('[name=password]').val();

    if(username.length === 0){
        warn('邮件不能为空');
        return false;
    }
    if(!validateEmail(username)){
        warn('邮件不合法');
        return false;
    }
    if(password.length === 0){
        warn('密码不能为空');
        return false;
    }
    return true;
}

function warn(msg){
    $('.alert').hide();
    $('.alert-danger').html(msg).show();
}

function info(msg){
    $('.alert').hide();
    $('.alert-success').html(msg).show();
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}