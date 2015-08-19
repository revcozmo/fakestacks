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
            success: function(data) {
            	var tpl = new EJS({url : 'templates/potentialBetTemplate.ejs' }).render(tpl, {bet: data});
        		$( ".no-games-info-message" ).remove();
        		$(tpl).appendTo(".potential-bet-list");
        		$( ".bet-amount" ).blur(blurHandler);
        		$( "button.close" ).click(closeHandler);
            },
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

	$( ".bet-amount" ).blur(blurHandler);

	$( "button.close" ).click(closeHandler);

	$( "#review-bets" ).click(reviewBets);	

});

var blurHandler = function( event ) {
	var betId = $(event.target).closest('.list-group-item')[0].dataset.betId;
	var value = event.target.value;
	//Do some validation on the amount here
	var data = {amount: value};
	$.ajax({
        type: 'GET',
        url: "cart/edit/"+betId,
        data: data,
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
}

var closeHandler = function( event ) {
	var betId = $(event.target).closest('.list-group-item')[0].dataset.betId;
	var value = event.target.value;
	console.log("close handler");
	$.ajax({
        type: 'GET',
        url: "cart/destroy/"+betId,
        contentType: 'application/json',
        context: this,
        complete: function() {
        	if ($( ".bet-amount" ).length == 0) {
        		var tpl = new EJS({url : 'templates/noGamesMessage.ejs' }).render(tpl);
        		$(tpl).prependTo(".potential-bet-panel .panel-body");
        	}
        }
    });
}

var reviewBets = function(event) {
	var totalAmount = 0;
	$.each($(".bet-amount"), function( index, betInput ) {
	  	totalAmount += parseInt(betInput.value);
	});
	alert("Total Bet: " + totalAmount);
}