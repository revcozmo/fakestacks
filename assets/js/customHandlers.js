$(document).ready(function(){
	
	$( ".bet-btn" ).click(betButtonHandler);
	$( ".bet-amount" ).blur(blurHandler);
	$( "button.close" ).click(closeHandler);
	$( "#review-bets" ).click(reviewBets);
	$( "#confirm-bets" ).click(confirmBets);
	$( ".win-button" ).click(winButtonHandler);
    $( ".push-button" ).click(pushButtonHandler);
	$( ".loss-button" ).click(lossButtonHandler);
    $( ".gametime" ).text(replaceDates);
    $( ".gametime" ).removeClass("gametime");

});

var betButtonHandler = function( event ) {
  	event.preventDefault();
  	var el = $(event.target);
  	var bettableId = el.data('bettableId');
  	var sideId = el.data('sideId');
  	var bet = {bettableId: bettableId, sideId: sideId};
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
            $( ".gametime" ).text(replaceDates);
            $( ".gametime" ).removeClass("gametime");

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

var blurHandler = function( event ) {
	var sideId = $(event.target).closest('.list-group-item')[0].dataset.sideId;
	var value = event.target.value;
	//Do some validation on the amount here
	var data = {amount: value};
	$.ajax({
        type: 'GET',
        url: "cart/edit/"+sideId,
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
	var sideId = $(event.target).closest('.list-group-item')[0].dataset.sideId;
	var value = event.target.value;
	$.ajax({
        type: 'GET',
        url: "cart/destroy/"+sideId,
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
    if (validateBets()) {
    	location.href = "confirmation";
    }
}

var validateBets = function() {
    var totalAmount = getTotalBetAmount();
    $(".bet-amount").each(function( index ) {
        if (isNaN(this.value)) {
            $("#betting-errors").show();
            return false;
        }
    });
    return true;
}

var confirmBets = function(event) {
	location.href = "bet/create";
}

var winButtonHandler = function(event) {
	winLossHandler(event, true);
}

var lossButtonHandler = function(event) {
	winLossHandler(event, false);
}

var pushButtonHandler = function(event) {
    winLossHandler(event, null);
}

var winLossHandler = function(event, win) {
	var el = $(event.target);
	var betId = el.data().betId;
    var data = {complete: true};
    if (win!=null) {
        data.win = win;
    }
	$.ajax({
        type: 'GET',
        data: data,
        url: "bet/update/"+betId,
        contentType: 'application/json',
        context: this,
        complete: function() {
        	el.closest('.list-group-item').hide();
        }
    });
}

var replaceDates = function(index, text) {
    var timeInSeconds = Date.parse(text);
    var m = moment(timeInSeconds);
    var niceDate = m.format("dddd, MMM Do, h:mma z");
    $(".gametime")[index].innerText = niceDate;
}

var getTotalBetAmount = function() {
	var totalAmount = 0;
	$.each($(".bet-amount"), function( index, betInput ) {
	  	totalAmount += parseInt(betInput.value);
	});
	return totalAmount;
}