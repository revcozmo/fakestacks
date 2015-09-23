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
    el.prop('disabled', true);
  	var bettableId = el.data('bettableId');
  	var sideId = el.data('sideId');
    var over = el.data('over');
  	var bet = {bettableId: bettableId, sideId: sideId, over:over};
  	$.ajax({
        type: 'GET',
        url: "cart/create",
        data: bet,
        contentType: 'application/json',
        context: this,
        success: function(data) {
            el.removeClass('btn-primary');
        	var tpl = new EJS({url : 'templates/potentialBetTemplate.ejs' }).render(tpl, {bet: data, confirmation: false});
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
	var data = getBetInfoFromCard(event)
    data.amount = event.target.value;
	$.ajax({
        type: 'GET',
        url: "cart/edit/",
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
	var betInfo = getBetInfoFromCard(event);
    $.ajax({
        type: 'GET',
        data: betInfo,
        url: "cart/destroy/",
        contentType: 'application/json',
        context: this,
        complete: function() {
            var el = getButtonFromBetInfo(betInfo);
            el.prop('disabled', false);
            el.addClass('btn-primary');
        	if ($( ".bet-amount" ).length == 0) {
        		$( ".no-games-info-message" ).show();
        		$( ".ul-total-tally" ).hide();
        	}
        	$( "#num-bets" ).text($(".bet-amount").length);
        	$( "#bets-total-amount" ).text(getTotalBetAmount());
        }
    });
}

var getBetInfoFromCard = function(event) {
    var bettableId = $(event.target).closest('.list-group-item')[0].dataset.bettableId;
    var sideId = $(event.target).closest('.list-group-item')[0].dataset.sideId;
    var over = $(event.target).closest('.list-group-item')[0].dataset.over;
    return {bettableId: bettableId, sideId:sideId, over:over};
}

var getButtonFromBetInfo = function(betInfo) {
    if (!betInfo.over || betInfo.over.length == 0) {
        return $('[data-bettable-id="'+betInfo.bettableId+'"]').filter('[data-side-id="'+betInfo.sideId+'"]');
    }
    else {
        return $('[data-bettable-id="'+betInfo.bettableId+'"]').filter('[data-over="'+betInfo.over+'"]');
    }
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
    $(".gametime").eq(index).text(niceDate);
}

var getTotalBetAmount = function() {
	var totalAmount = 0;
	$.each($(".bet-amount"), function( index, betInput ) {
	  	totalAmount += parseInt(betInput.value);
	});
	return totalAmount;
}