const User = require('../model/User');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
exports.login = async (req, res) => {
    try {
        console.log(req.body)
        const { username, password } = req.body;
        if (!username || !password) {
            return res.json({ message: 'Заполните все поля!', status: false });
        }
        const duplicateUser = await User.findOne({ username }).exec();
        if (duplicateUser) {
            if (CryptoJS.SHA256(password) + '' !== duplicateUser.password)
                return res.json({ message: `Неправильный пароль`, status: false });
            let jwt = generateAccessToken(duplicateUser._id)
            return res.json({
                status: true,
                jwt: jwt
            });
        } else {
            return res.json({ message: `Пользователь с таким именем не существует`, status: false });
        }
    } catch (error) {
        res.json({ message: error.message, status: false });
    }
};

function generateAccessToken(user_id) {
    return jwt.sign({ user_id }, process.env.SALT, { expiresIn: '30d' });
}

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .json({ message: 'Заполните все поля!', status: false });
        }
        const duplicateUser = await User.findOne({ username }).exec();
        if (duplicateUser) {
            return res.json({ message: `Пользователь с таким именем уже существует`, status: false });
        }
        const result = await User.create({
            username,
            password: CryptoJS.SHA256(password)
        });
        let jwt = generateAccessToken(result._id.toString())
        return res.json({
            status: true,
            jwt: jwt
        });
    } catch (error) {
        res.json({ message: error.message, status: false });
    }
};

exports.checkAuthorized = async (req, res) => {
    res.json({
        status: true
    });
};  