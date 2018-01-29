$(document).ready(function(){

    $("#video").on("error", function(){
        $(this).attr('src', './video-placeholder.png');
    });

    $('#video').attr('src', window.location.protocol + '//' + window.location.hostname + '/vid');

    var reOrientate = function(){
        if(screen.orientation.angle == 0){
            $('#center').attr('class', 'center-vertical');
            $('.side').attr('class', 'side side-vertical');
            setTimeout(function(){
                var imgHeight = $('img#video').css('height');
                $('#stat').css('top', imgHeight);
            }, 500);
        } else {
            $('#center').attr('class', 'center-horizontal');
            $('#stat').css('top', '0px');
            $('.side').attr('class', 'side side-horizontal');
        }
    }

    window.addEventListener("orientationchange", function(event) {
        reOrientate();
    }, false);

    reOrientate();
    
    var license = (new ClientJS()).getFingerprint();
    var movement = {Forward: 0, Reverse: 0, Left: 0, Right: 0, License: license};    

    var Move = function(){
        if (ws) { ws.send(JSON.stringify(movement)); }
    }

    $('#refresh').on('click', function(){
        window.location = window.location.protocol + '//' + window.location.host;
    });

    $('#sign-out').on('click', function(){
        $.removeCookie('carkey', {path : '/'});
        window.location = window.location.protocol + '//' + window.location.host;
    });

    //LEFT
    var left = document.getElementById('left');
    
    noUiSlider.create(left, {
        start: [0],
        direction: 'rtl',
        orientation: 'vertical',
        behaviour: 'tap-drag',
        multitouch: true,
        step: 1,
        range: {
            'min': -10,
            'max': 10
        }
    });

    left.noUiSlider.on('slide', function(){
        var l = left.noUiSlider.get();
        $('#leftDiv').html("Left: " + l);
    });

    left.noUiSlider.on('end', function(){
        left.noUiSlider.set(0);
        $('#leftDiv').html("Left: " + 0);
    });

    //RIGHT
    var right = document.getElementById('right');
    
    noUiSlider.create(right, {
        start: [0],
        direction: 'rtl',
        orientation: 'vertical',
        behaviour: 'tap-drag',
        multitouch: true,
        step: 1,
        range: {
            'min': -10,
            'max': 10
        }
    });

    right.noUiSlider.on('slide', function(){
        var r = right.noUiSlider.get();
        $('#rightDiv').html("Right: " + r);
    });

    right.noUiSlider.on('end', function(){
        right.noUiSlider.set(0);
        $('#rightDiv').html("Right: " + 0);
    });

    var ws;
    var wsUri = "ws:";
    if (window.location.protocol === "https:") { wsUri = "wss:"; }
    wsUri += "//" + window.location.host + window.location.pathname.replace('picar', '') + "ws/picar";

    /*
    ws = new WebSocket(wsUri);
    
    ws.onmessage = function(msg) {
        $('#stat').html(msg.data);
        if(msg.data === 'Connection Timeout'){
            window.location = 'http://' + window.location.host;
        }
    }

    ws.onopen = function() {
        movement.Forward = 0;
        movement.Reverse = 0;
        movement.Left = 0;
        movement.Right = 0;
        Move();
    }

    ws.onclose = function() {
        // in case of lost connection tries to reconnect every 3 secs
        setTimeout(wsConnect,3000);
    }
    */

    $('.menu-btn').on('click', function() {
        if($('.menu').css('width') === '0px'){
            $('.menu').css('width', '200px');
        }
        else {
            $('.menu').css('width', '0px');
        }
    });
});