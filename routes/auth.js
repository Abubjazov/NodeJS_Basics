const { Router } = require('express')
const bcrypt = require('bcryptjs')
const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')

const User = require('../models/user')
const regEmail = require('../emails/registration')
const resetPasswd = require('../emails/resetPasswd')
const router = Router()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        loginError: req.flash('loginError'),
        registrationError: req.flash('registrationError'),
        registrationSuccess: req.flash('registrationSuccess')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const candidate = await User.findOne({ email })

        if (candidate) {
            const isPassword = await bcrypt.compare(password, candidate.password)

            if (isPassword) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) throw err

                    res.redirect('/')
                })

            } else {
                req.flash('loginError', 'Invalid password')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', `User < ${email} > not registered`)
            res.redirect('/auth/login#login')
        }

    } catch (err) {
        throw err
    }
})

router.post('/registration', async (req, res) => {
    try {
        const { email, password, repeat, name } = req.body
        const candidate = await User.findOne({ email })

        if (candidate) {
            req.flash('registrationError', `A user with email: < ${email} > is already registered`)
            res.redirect('/auth/login#registration')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart: { items: [] }
            })

            await user.save()

            req.flash('registrationSuccess', `User < ${email} > registered successfully`)
            res.redirect('/auth/login#login')

            sgMail
                .send(regEmail(email))
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    } catch (err) {
        throw err
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Reset password',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something went wrong, please try again later.')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({ email: req.body.email })

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExpiration = Date.now() + 3600000

                await candidate.save()

                sgMail
                    .send(resetPasswd(candidate))
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.error(error)
                    })

                res.redirect('/auth/login#login')
            } else {
                req.flash('error', `User < ${req.body.email} > is not registered`)
                res.redirect('/auth/reset')
            }
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        // req.flash('error', 'Invalid token')
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExpiration: { $gt: Date.now() }
        })

        if (!user) {
            req.flash('error', 'Invalid login')
            return res.redirect('/auth/login')
        } else {
            res.render('auth/passwd', {
                title: 'Recovery access',
                userId: user._id.toString(),
                token: req.params.token,
                error: req.flash('error')
            })
        }
    } catch (err) {
        console.log(err)
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExpiration: { $gt: Date.now() }
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExpiration = undefined

            await user.save()

            res.redirect('/auth/login#login')
            // req.flash('success', `User < ${user.email} > password changed successfully`)
        } else {
            res.redirect('/auth/login')
            // req.flash('error', 'Sorry an error has occured. Please try again later.')
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
