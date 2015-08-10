$(document).ready(function(){
	
	console.log("ready");
	$( ".bet-btn" ).submit(function( event ) {
	  	alert( "Handler for .submit() called." );
	  	event.preventDefault();
	});
	$( ".bet-btn" ).click(function( event, otherThing ) {
	  	alert( "Handler for .click() called." );
	  	event.preventDefault();
	});

});