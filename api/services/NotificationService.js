module.exports = {

  sendBetNotification: function(bet) {
    var notification = {
      user: bet.user,
      scope: Bet.tableName,
      refId: bet.id,
      action: "Processed Bet"
    };
    Notification.create(notification, function notificationCreated(err) {
      if (err) {
        console.log("Could not create notification: " + err);
      }
    });
  }

}
