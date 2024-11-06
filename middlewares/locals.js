const locals = (req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated; // isAuthenticated değişkenini tüm view'larda kullanabilmek için
    res.locals.email = req.session.email; // email değişkenini tüm view'larda kullanabilmek için
    next();
};

module.exports = locals;
