$(document).ready(function(){

    $('#video').attr('src', 'http://' + window.location.hostname + ':8081/?action=stream');

    var reOrientate = function(){
        if(screen.orientation.angle == 0){
            $('#center').attr('class', 'center-vertical');
            $('.side').css('min-height', '120vh');
        } else {
            $('#center').attr('class', 'center-horizontal');
            $('.side').css('min-height', '100vh');
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
        window.location = 'http://' + window.location.host + '/picar';
    });

    //FWD
    $('#fwd').on('tapstart', function(e){
        $(this).css('background-color', 'rgb(100,100,255)');
        $('#rev').css('background-color', 'rgb(169,169,169)');
        $(this).css('outline', 'none');
        $(this).css('border', 'none');
        movement.Forward = 1;
        movement.Reverse = 0;
        Move();
    });

    $('#fwd').on('tapend', function(e){
        $(this).css('background-color', 'rgb(169, 169, 169)');
        $(this).css('outline', 'none');
        $(this).css('border', 'none');
        movement.Forward = 0;
        Move();  
    });

    //REV
    $('#rev').on('tapstart', function(e){
        $(this).css('background-color', 'rgb(100,100,255)');
        $('#fwd').css('background-color', 'rgb(169,169,169)');
        $(this).css('outline', 'none');
        $(this).css('border', 'none');
        movement.Reverse = 1;
        movement.Forward = 0;
        Move();
    });

    $('#rev').on('tapend', function(e){
        $(this).css('background-color', 'rgb(169, 169, 169)');
        $(this).css('outline', 'none');
        $(this).css('border', 'none');
        movement.Reverse = 0;
        Move();
    });

    //LEFT
    $('#left').on('tapstart', function(e){
        $(this).css('background-color', 'rgb(100,100,255)');
        $('#right').css('background-color', 'rgb(169,169,169)');
        $(this).css('outline', 'none');
        $(this).css('border', 'none');
        movement.Left = 1;
        movement.Right = 0;
        Move();
    });

    $('#left').on('tapend', function(e){
        $(this).css('background-color', 'rgb(169, 169, 169)');
        $(this).css('outline', 'none');
        $(this).css('border', 'none');
        movement.Left = 0;
        Move();
    });

    //RIGHT
    $('#right').on('tapstart', function(e){
        $(this).css('background-color', 'rgb(100,100,255)');
        $('#left').css('background-color', 'rgb(169,169,169)');
        $(this).css('outline', 'none');
        $(this).css('border', 'none');
        movement.Right = 1;
        movement.Left = 0;
        Move();
    });

    $('#right').on('tapend', function(e){
        $(this).css('background-color', 'rgb(169, 169, 169)');
        $(this).css('outline', 'none');
        $(this).css('border', 'none');
        movement.Right = 0;
        Move();
    });
    
    var ws;
    var wsUri = "ws:";
    var loc = window.location;
    if (loc.protocol === "https:") { wsUri = "wss:"; }
    wsUri += "//" + loc.host + loc.pathname.replace("picar","ws/picar");

    ws = new WebSocket(wsUri);
    
    ws.onmessage = function(msg) {
        $('#stat').html(msg.data);
        if(msg.data === 'Connection Timeout'){
            window.location = 'http://' + window.location.host + '/picar';
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
});