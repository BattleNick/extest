var port = 3000;
var socket = io.connect('http://localhost:' + port);


socket.on('eventDrag', function(flag){
    if(flag == true){
        ball.classList.add('nodrag');
    } else {
        if(ball.classList.contains('nodrag')){
            ball.classList.remove('nodrag');
        }
    }
});

socket.on('messageToClients', function(left, top){

    if(ball.classList.contains('nodrag')){
        ball.style.left = left;
        ball.style.top = top;
    }

});

var ball = document.getElementById('ball');
ball.style.position = 'absolute';


ball.onmousedown = function(e) {

    if(ball.classList.contains('nodrag')){
        return false;
    } else {

    }

    var coords = getCoords(ball);
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;

    document.body.appendChild(ball);
    socket.emit('ifDrag', true);
    moveAt(e);

    ball.style.zIndex = 1000; // над другими элементами



    document.onmousemove = function(e) {
        moveAt(e, shiftX, shiftY);
    };

    ball.onmouseup = function() {
        document.onmousemove = null;
        ball.onmouseup = null;

        socket.emit('ifDrag', false);
    };

}

function moveAt(e, shiftX, shiftY) {
    ball.style.left = e.pageX - shiftX + 'px';
    ball.style.top = e.pageY - shiftY + 'px';

    socket.emit('message', { left: ball.style.left, top: ball.style.top });
    // console.log(ball.style.left, ball.style.top);
}

ball.ondragstart = function() {
    return false;
};

function getCoords(elem) {
    // (1)
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    // (2)
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    // (3)
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    // (4)
    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    // (5)
    return { top: Math.round(top), left: Math.round(left) };
}