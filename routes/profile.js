const { Router } = require('express')
const router = Router()

const User = require('../models/user')
const routeProtector = require('../middleware/route-protector')

router.get('/', routeProtector, async (req, res) => {
    res.render('profile', {
        title: 'Profile',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', routeProtector, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const toChange = {
            name: req.body.name
        }

        if (req.file) {
            toChange.avatarUrl = req.file.path
        }

        Object.assign(user, toChange)

        await user.save()

        res.redirect('/profile')
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
