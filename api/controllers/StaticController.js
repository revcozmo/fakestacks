/**
 * StaticController
 *
 * @description :: Server-side logic for managing statics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'index': function (req, res) {
	  if (!req.session.League) {
	    return res.view();
    }
    var p1 = new Promise(function(resolve, reject) {
      var league = req.session.League;
      Gambler.find().where({league: league.id}).populate('bets', {where: {archived: false}}).populate('user').exec(function (err, gamblers) {
        if (err) {
          reject(err);
        }
        for (var i=0; i<gamblers.length; i++) {
          var tallies = BetService.getBetTallies(gamblers[i].bets, league.startingAccount);
          for (var prop in tallies) {
            gamblers[i][prop]=tallies[prop];
          }
        }
        gamblers.sort(function(gambler1, gambler2){return (gambler2.money-gambler1.money==0) ? (gambler2.wins-gambler1.wins) : (gambler2.money-gambler1.money)});
        gamblers = gamblers.slice(0, 8);
        resolve(gamblers);
      });
    });
    var p2 = new Promise(function(resolve, reject) {
      var leagueId = req.session.League.id;
      Gambler.find().where({league: leagueId}).exec(function (err, gamblers) {
        if (err) return res.serverError(err);
        var gamblerIds = gamblers.map(g => g.id);
        Bet.find().where({complete:false, gambler:gamblerIds}).populate('bettable').populate('gambler').sort('amount DESC').limit(4).exec(function(err,bets) {
          if (err) {
            reject(err);
          }
          resolve(bets);
        });
      });
    });

    var shortenTeamName = function(teamName) { return teamName; };

    if (req.session.League.sport == "NFL") {
      shortenTeamName = function(teamName) {
        var lastIndex = teamName.lastIndexOf(" ");
        return teamName.substring(0, lastIndex);
      };
    }

    Promise.all([p1, p2])
      .then(function(results) {
        res.view({gamblers: results[0], bets: results[1], shortenTeamName: shortenTeamName});
      })
      .catch(function(err) {
        console.log("Failed:", err);
      });

	},
};

