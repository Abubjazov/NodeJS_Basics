const { body, validationResult } = require('express-validator')
const User = require('../models/user')

exports.registrationValidators = [
    body('name')
        .isLength({ min: 2 })
        .withMessage('The name must be at least 2 characters')
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Please enter correct email')
        .custom(async (value, { req }) => {
            try {
                const candidate = await User.findOne({ email: value })

                if (candidate) {
                    return Promise.reject(`A user with email: < ${value} > is already registered`)
                }
            } catch (err) {
                console.log(err)
            }

        })
        .normalizeEmail(),
    body('password', 'Minimum password length 8 characters')
        .isLength({ min: 8, max: 56 })
        .isAlphanumeric()
        .trim(),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password mismatch')
            }

            return true
        })
        .trim()
]
