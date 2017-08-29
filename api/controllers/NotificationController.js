/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  //TODO: This name should change in the future, since this is now for all notifications
  processedbets: function (req, res) {
    Notification.find().where({
      sent: false,
      scope: User.tableName
    }).populate('user').exec(function foundNotifications(err, notifications) {
      _.each(notifications, function (notification) {
        User.findOne(notification.refId).exec(function (err, invitedUser) {
          var admin = notification.user;
          sails.hooks.email.send(
            "welcome",
            {
              admin: admin,
              user: invitedUser
            },
            {
              to: invitedUser.email,
              subject: "Welcome to Fake Stacks"
            },
            function (err) {
              if (err) {
                console.log("Could not send email: " + err);
              }
              Notification.update({scope: User.tableName, refId: invitedUser.id}, {sent: true}).exec(function (err) {
                console.log("Notification sent");
              });
            }
          );
        })
      })
    })

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

