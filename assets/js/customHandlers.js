$(document).ready(function(){
	
	$( ".bet-btn" ).click(function( event ) {
	  	event.preventDefault();
	  	var el = $(event.target);
	  	var bettableId = el.data('bettableId');
	  	var betId = el.data('betId');
	  	var bet = {bettableId: bettableId, betId: betId};
	  	$.ajax({
            type: 'GET',
            url: "cart/create",
            data: bet,
            contentType: 'application/json',
            context: this,
            statusCode: {
			    403: function() {
			      window.location.href = 'session/new';
			    },
			    400: function(data) {
			    	alert("Error", data);
			    },
			    500: function(data) {
			    	alert("Error", data);
			    }
  			}
        });
	});

});