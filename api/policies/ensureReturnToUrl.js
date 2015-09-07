'use strict';

module.exports = function (req, res, next) {
  req.session.returnTo = req.url;
  return next();
};