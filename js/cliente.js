
var socket =io.connect('http://localhost:1337');
var sms=$('#msgtpl').html()
$('#msgtpl').remove()

var User;
$('#loginform').submit(function (e) {
e.preventDefault()
socket.emit('login',{
    username:$('#username').val(),
    mail:$('#mail').val()
})
})

socket.on('newusr',function (user) {
    $('#user').append('<img src=" '+user.avatar+'" id="'+user.id+'">')
})

socket.on('logged',function (user) {
    User=user
    $('#login').fadeOut()
})

socket.on('disusr' ,function (user) {
    $('#'+user.id).remove()
})


$('#form').submit(function (e) {
    e.preventDefault()
    var msg={message:$('#message').val()
}
    console.log(msg)
    msg.user=User
    date=new Date();
    msg.h=date.getHours()
    msg.m=date.getMinutes()
    $('#messages').append('<div class="message messageSend ">'+Mustache.render(sms,msg)+'</div>')
    $('#messages').animate({scrollTop   :$('#messages').prop('scrollHeight')},500)
    socket.emit('newmsg',{message:$('#message').val(),username:User})
   $('#message').val('')
   $('#message').focus()

})

socket.on('newmsg',function (msg) {
    $('#messages').append('<div class="message messageArrive separator">'+Mustache.render(sms,msg)+'</div>')
    $('#messages').animate({scrollTop   :$('#messages').prop('scrollHeight')},500)
})