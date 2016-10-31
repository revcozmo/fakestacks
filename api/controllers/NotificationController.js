/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  processedbets: function (req, res) {
    Notification.find().where({
      sent: false,
      scope: Bet.tableName
    }).populate('user').sort({user: 'asc'}).exec(function foundNotifications(err, notifications) {
      var notificationsByUserHash = _.groupBy(notifications, 'user.id');
      _.each(Object.keys(notificationsByUserHash), function (userId) {

        async.map(notificationsByUserHash[userId], function (notification, callback) {
          Bet.findOne(notification.refId).populate('bettable').exec(function (err, bet) {
            callback(err, bet);
          });
        }, function (err, bets) {
          var user = notificationsByUserHash[bets[0].user][0].user;
          if (user.notifyprocessedbets == true) {
            sails.hooks.email.send(
              "processedBets",
              {
                bets: bets
              },
              {
                to: user.email,
                subject: "Your bets have been processed"
              },
              function (err) {
                if (err) {
                  console.log("Could not send email: " + err);
                }
                _.each(bets, function (bet) {
                  Notification.update({scope: Bet.tableName, refId: bet.id}, {sent: true}).exec(function (err) {
                    console.log("Notification sent");
                  });
                })
              }
            );
          }
          else {
            _.each(bets, function (bet) {
              Notification.update({scope: Bet.tableName, refId: bet.id}, {sent: true}).exec(function (err) {
                console.log("User has opted out of email. Notification marked as sent");
              });
            });
          }
          res.ok();
        });

      });

    });
    res.ok();
  }

};

