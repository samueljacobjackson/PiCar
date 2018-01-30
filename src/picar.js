$(document).ready(function(){

    // Display Video
    $("#video").on("error", function(){
        $(this).attr('src', './video-placeholder.png');
    });
    $('#video').attr('src', window.location.protocol + '//' + window.location.hostname + '/vid');

    // Manage Orientation
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

    // Send Movement
    var movement = {Right: 0, Left: 0};    
    var Move = function(){
        console.log(JSON.stringify(movement));
        if (ws) { ws.send(JSON.stringify(movement)); }
    }

    // Left Tread
    var left = document.getElementById('left');
    noUiSlider.create(left, {
        start: [0],
        connect: [true, false],
        direction: 'rtl',
        orientation: 'vertical',
        behaviour: 'tap-drag',
        multitouch: true,
        step: 1,
        range: {
            'max': [255],
            '50%': [20],
            'min': [-100]
        }
    });
    left.noUiSlider.on('slide', function(){
        var val = left.noUiSlider.get();
        movement.Left = parseInt(val);
        Move();
    });
    left.noUiSlider.on('change', function(){
        left.noUiSlider.set(0);
        movement.Left = 0;
        Move();
    });

    // Right Tread
    var right = document.getElementById('right');
    noUiSlider.create(right, {
        start: [0],
        connect: [true, false],
        direction: 'rtl',
        orientation: 'vertical',
        behaviour: 'tap-drag',
        multitouch: true,
        step: 1,
        range: {
            'max': [255],
            '50%': [20],
            'min': [-127]
        }
    });
    right.noUiSlider.on('slide', function(){
        var val = right.noUiSlider.get();
        movement.Right = parseInt(val);
        Move();
    });
    right.noUiSlider.on('change', function(){
        right.noUiSlider.set(0);
        movement.Right = 0;
        Move();
    });

    // Web Socket
    var ws;
    var wsUri = "ws:";
    if (window.location.protocol === "https:") { wsUri = "wss:"; }
    wsUri += "//" + window.location.host + window.location.pathname.replace('picar', '') + "ws/picar";
    /*ws = new WebSocket(wsUri);
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
    }*/

    // Menu
    $('#refresh').on('click', function(){
        window.location = window.location.protocol + '//' + window.location.host + '/picar/demo/';
    });
    $('#sign-out').on('click', function(){
        //$.removeCookie('carkey', {path : '/'});
        window.location = window.location.protocol + '//' + window.location.host + '/picar/';
    });
    $('.menu-btn').on('click', function() {
        if($('.menu').css('right') === '0px'){
            $('.menu').css('right', '-180px');
        }
        else {
            $('.menu').css('right', '0px');
        }
    });
});