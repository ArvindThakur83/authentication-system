function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    req.session.redirectTo = req.originalUrl;
    res.redirect('/unauthorized');
  }
  module.exports = { isAuthenticated };
  