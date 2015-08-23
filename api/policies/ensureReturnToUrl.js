'use strict';

module.exports = function (req, res, next) {
  req.session.returnTo = req.url;
  console.log("ReturnTo set to " + req.session.returnTo);
  return next();
};