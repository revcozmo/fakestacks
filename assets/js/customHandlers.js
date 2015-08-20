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
        		$( ".no-games-info-message" ).hide();
        		$(tpl).appendTo(".potential-bet-list");
        		$( "#num-bets" ).text($(".bet-amount").length);
        		$( "#bets-total-amount" ).text(getTotalBetAmount());
        		$( ".ul-total-tally" ).show();
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
        complete: function() {
        	$( "#bets-total-amount" ).text(getTotalBetAmount());
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
        		$( ".no-games-info-message" ).show();
        		$( ".ul-total-tally" ).hide();
        	}
        	$( "#num-bets" ).text($(".bet-amount").length);
        	$( "#bets-total-amount" ).text(getTotalBetAmount());
        }
    });
}

var reviewBets = function(event) {
	alert("Total Bet: " + getTotalBetAmount());
}

var getTotalBetAmount = function() {
	var totalAmount = 0;
	$.each($(".bet-amount"), function( index, betInput ) {
	  	totalAmount += parseInt(betInput.value);
	});
	return totalAmount;
}