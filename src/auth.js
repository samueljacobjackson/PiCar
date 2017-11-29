$(document).ready(function(){
        
    $('.page-alert').hide();    
    
    $('.page-alert').on('click', function() {
        $('.page-alert').hide();    
    });
    
    $("form[ajax=true]").submit(function(e) {
        e.preventDefault();
        
        $('.page-alert').hide();    

        var form_data = {
            driver: $('#driver').val(),
            key: $('#key').val(),
            license: (new ClientJS()).getFingerprint()
        }
        var form_url = $(this).attr("action");
        var form_method = $(this).attr("method").toUpperCase();

        $.ajax({
            url: form_url, 
            type: form_method,      
            data: form_data,     
            cache: false,
            success: function(result) {                          
                if (result === 'failed') {
                    var alert = $('#alert');
                    alert.appendTo('.page-alerts');
                    alert.slideDown();
                }
                else if (result === 'succeeded') {
                    window.location = 'https://' + window.location.host;
                }
            }
        });    
    });
});