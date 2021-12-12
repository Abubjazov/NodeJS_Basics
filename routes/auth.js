const { Router } = require('express')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findById(process.env.USER_ID)

        req.session.user = user
        req.session.isAuthenticated = true

        req.session.save(err => {
            if (err) {
                throw err
            } else {
                res.redirect('/')
            }
        })
    } catch (err) {
        throw err
    }
})

router.post('/registration', async (req, res) => {
    try {
        const { email, password, repeat, name } = req.body
        const candidate = await User.findOne({ email })

        if (candidate) {
            res.redirect('/auth/login#login')
        } else {
            const user = new User({
                email, name, password, cart: { items: [] }
            })

            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch (err) {
        throw err
    }
})

module.exports = router
