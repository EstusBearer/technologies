const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const JWT_SECRET = 'your_jwt_secret_here';

router.post('/vitals', async (req, res) => {
    const { login, password } = req.body;
    try {
        const user = await User.findOne({ login }).exec();
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).send('Login failed: Incorrect password');
            }
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/verifyToken', (req, res) => {
    const { token } = req.body;
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send({ valid: false });
        } else {
            res.json({ valid: true });
        }
    });
});

router.patch('/user/medical', async (req, res) => {
    const {token, bloodType, weight, height} = req.body;
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            res.status(401).send({valid: false});
        } else {
            try {
                const user = await User.findById(decoded._id).exec();
                if (user) {
                    user.bloodType = bloodType;
                    user.weight = weight;
                    user.height = height;
                    await user.save();
                    res.json(user);
                } else {
                    res.status(404).send('User not found');
                }
            } catch (findErr) {
                console.error(findErr);
                res.status(500).send('Server error');
            }
        }
    });
});


router.post('/user/medical', async (req, res) => {
    const {token} = req.body;
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            res.status(401).send({valid: false});
        } else {
            try {
                const user = await User.findById(decoded._id).exec();
                if (user) {
                    const {bloodType, weight, height} = user; // getting bloodType, weight, height directly from user
                    res.json({bloodType, weight, height});
                } else {
                    res.status(404).send('User not found');
                }
            } catch (findErr) {
                console.error(findErr);
                res.status(500).send('Server error');
            }
        }
    });
});

module.exports = router;