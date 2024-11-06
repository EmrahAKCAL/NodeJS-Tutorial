const auth = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/account/login?redirect=' + req.originalUrl);
    }
    next();
}

module.exports = auth;
