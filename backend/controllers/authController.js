const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const duplicate = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (duplicate) {
            return res.status(409).json({
                message: 'User already exists'
            });
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPwd
        });

        res.status(201).json({
            message: 'User Registered Successfully'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Server Error'
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login Email:', email);

        const foundUser = await User.findOne({ email });

        console.log('Found User:', foundUser);

        if (!foundUser) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        const match = await bcrypt.compare(
            password,
            foundUser.password
        );

        console.log('Password Match:', match);

        if (!match) {
            return res.status(401).json({
                message: 'Invalid Password'
            });
        }

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    id: foundUser._id,
                    email: foundUser.email
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ accessToken });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};
module.exports = {
    registerUser,
    loginUser
};