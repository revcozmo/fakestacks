/**
 * StaticController
 *
 * @description :: Server-side logic for managing statics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'index': function (req, res) {
    var p1 = new Promise(function(resolve, reject) {
      var league = req.session.User.league;
      User.find().where({league: league.id}).populate('bets').exec(function foundUsers(err, users) {
        if (err) {
          reject(err);
        }
        for (var i=0; i<users.length; i++) {
          var tallies = BetService.getBetTallies(users[i].bets, league.startingAccount);
          for (var prop in tallies) {
            users[i][prop]=tallies[prop];
          }
        }
        users.sort(function(user1, user2){return (user2.money-user1.money==0) ? (user2.wins-user1.wins) : (user2.money-user1.money)});
        users = users.slice(0, 8);
        resolve(users);
      });
    });
    var p2 = new Promise(function(resolve, reject) {
      var leagueId = req.session.User.league.id;
      User.query('SELECT id FROM users where league = ' + leagueId, function(err, results) {
        if (err) return res.serverError(err);
        var userIds = results.rows.map(function(row) { return row.id });
        Bet.find().where({complete:false, user:userIds}).populate('bettable').populate('user').sort('amount DESC').limit(4).exec(function(err,bets) {
          if (err) {
            reject(err);
          }
          resolve(bets);
        });
      });
    });

    var shortenTeamName = function(teamName) { return teamName; };

    if (req.session.User.league.sport == "NFL") {
      shortenTeamName = function(teamName) {
        var lastIndex = teamName.lastIndexOf(" ");
        return teamName.substring(0, lastIndex);
      };
    }

    Promise.all([p1, p2])
      .then(function(results) {
        return res.view({users: results[0], bets: results[1], shortenTeamName: shortenTeamName});
      })
      .catch(function(err) {
        console.log("Failed:", err);
      });

	},
};

