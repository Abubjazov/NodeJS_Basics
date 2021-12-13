const { Router } = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')

const User = require('../models/user')
const regEmail = require('../emails/registration')
const router = Router()
const transporter = nodemailer.createTransport(sendgrid({
    auth: { api_key: process.env.SENDGRID_API_KEY }
}))

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
            res.redirect('/auth/login#registration')

            await transporter.sendMail(regEmail(email))
        }
    } catch (err) {
        throw err
    }
})

module.exports = router
