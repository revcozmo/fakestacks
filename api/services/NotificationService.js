module.exports = {

  sendBetNotification: function(bet) {
    var notification = {
      user: bet.gambler.user,
      scope: Bet.tableName,
      refId: bet.id,
      action: "Processed Bet"
    };
    Notification.create(notification, function notificationCreated(err) {
      if (err) {
        console.log("Could not create notification: " + err);
      }
    });
  },

  sendWelcomeNotification: function(user, admin) {
    var notification = {
      user: admin,
      scope: User.tableName,
      refId: user.id,
      action: "User Created"
    };
    Notification.create(notification, function notificationCreated(err) {
      if (err) {
        console.log("Could not create notification: " + err);
      }
    });
  }

}
