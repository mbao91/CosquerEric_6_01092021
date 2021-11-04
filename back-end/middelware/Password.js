const passwordSchemas = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchemas.validate(req.body.password)) {
        res
        .status(400)
        .json({ error: 'Le MDP doit contenir 8 caractères au minimum, avec une maj, une min et un chiffre.' });
    } else {
        next();
    }
}