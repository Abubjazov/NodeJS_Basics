const { Router } = require('express')
const { validationResult } = require('express-validator')
const Course = require('../models/course')
const { courseValidators } = require('../utils/validators')
const router = Router()
const routeProtector = require('../middleware/route-protector')

router.get('/', routeProtector, (req, res) => {
    res.render('add-course', {
        title: 'Add course',
        isAddCourse: true
    })
})

router.post('/', routeProtector, courseValidators, async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('add-course', {
            title: 'Add course',
            isAddCourse: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img
            }
        })
    }

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user._id
    })

    try {
        await course.save()
        res.redirect('/courses')
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
