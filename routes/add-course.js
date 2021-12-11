const { Router } = require('express')
const Course = require('../models/course')
const router = Router()
const routeProtector = require('../middleware/routes-protector')

router.get('/', routeProtector, (req, res) => {
    res.render('add-course', {
        title: 'Add course',
        isAddCourse: true
    })
})

router.post('/', routeProtector, async (req, res) => {
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
