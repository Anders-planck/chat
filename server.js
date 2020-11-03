var http=require('http');
var md5=require('MD5');

httpServer=http.createServer(function (req,res) {
   console.log('un user a afficher la page')
})

httpServer.listen(1337);

var io= require('socket.io').listen(httpServer);
var users={}
var sms=[]
var me;
io.sockets.on('connection',function (socket) {

    for (var k in users){
        socket.emit('newusr',users[k])
        console.log(users[k])
    }

    for (var k in sms){
        socket.emit('newmsg',sms[k])
        console.log(sms[k])
    }


    socket.on('login',function (user) {
        
        me=user;
        me.id=user.mail.replace('@','-').replace('.','-');
        me.avatar='http://gravatar.com/avatar/'+md5(user.mail)+'?s=90';
     // socket.broadcast.emit('newusr');
     users[me.id]=me
     socket.emit('logged',me)
         io.sockets.emit('newusr',me)


    })  
socket.on('newmsg',function (msg) {
  
    msg.user=msg.username
    date=new Date();
    msg.h=date.getHours()
    msg.m=date.getMinutes()
    sms.push(msg)
    console.log(msg)
    socket.broadcast.emit('newmsg',msg)
})
    socket.on('disconnect',function () {
        if (!me){
            return false;
        }
        delete users[me.id];
        io.sockets.emit('disusr',me)
    })
})


