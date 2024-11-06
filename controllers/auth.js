const User = require('../models/User');
const bcrypt = require('bcrypt');

const get_register = async (req, res) => {
    try {
        return res.render('account/register', {
            title: 'Register'
        });
    } catch (error) {
        res.render('errors/500');
    }
}

const post_register = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({
            where: {
                email: data.email
            }
        });
        if (user) {
            return res.render('account/register', {
                title: 'Register',
                error: 'This email is already registered.'
            });
        }
        const newUser = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: await bcrypt.hash(data.password, 10)
        }
        await User.create(newUser);
        req.session.message = 'You have successfully registered. Please login.';
        req.session.save((err) => {
            if (err) {
                return res.render('account/register', {
                    title: 'Register',
                    message: 'An error occurred. Please try again.'
                });
            }
            return res.redirect('/account/login');
        });
    } catch (error) {
        console.log(error);
    }
}

const get_login = async (req, res) => {
    try {
        const { message, error } = req.session;
        delete req.session.message;
        delete req.session.error;
        return res.render('account/login', {
            title: 'Login',
            message,
            error
        });
    } catch (error) {
        res.render('errors/500');
    }
}

const post_login = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({
            where: {
                email: data.email
            }
        });
        if (!user) {
            req.session.message = 'Invalid email or password.';
            req.session.error = true;
            req.session.save(() => res.redirect('/account/login'))
        }
        const isPasswordMatch = await bcrypt.compare(data.password, user.password);
        if (!isPasswordMatch) {
            req.session.message = 'Invalid email or password.';
            req.session.error = true;
            req.session.save(() => res.redirect('/account/login'))
        }
        // res.cookie('isAuthenticated', true);
        req.session.isAuthenticated = true;
        req.session.email = user.email
        req.session.save((err) => {
            if (err) {
                return res.render('account/login', {
                    title: 'Login',
                    message: 'An error occurred. Please try again.'
                });
            }
            const redirect = req.query.redirect || '/';
            return res.redirect(redirect);
        });

    } catch (error) {
        console.log(error);
    }
}

const get_logout = async (req, res) => {
    try {
        // res.clearCookie('isAuthenticated');
        await req.session.destroy();
        return res.redirect('/account/login');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    get_register,
    post_register,
    get_login,
    post_login,
    get_logout
}
