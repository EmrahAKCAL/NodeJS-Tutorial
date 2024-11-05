const User = require('../models/User');

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
        await User.create(data);
        return res.redirect('/account/login?success=true');
    } catch (error) {
        console.log(error);
    }
}

const get_login = async (req, res) => {
    const { success } = req.query || false;
    try {
        return res.render('account/login', {
            title: 'Login',
            success
        });
    } catch (error) {
        res.render('errors/500');
    }
}


module.exports = {
    get_register,
    post_register,
    get_login
}
