const { Router } = require('express')
const Course = require('../models/course')
const router = Router()
const routeProtector = require('../middleware/route-protector')

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('userId', 'email name').lean()

        res.render('courses', {
            title: 'Courses',
            isCourses: true,
            userId: req.user ? req.user._id : null,
            courses
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).lean()

    res.render('course', {
        layout: 'course',
        title: `${course.title}`,
        course
    })
})

router.post('/edit', routeProtector, async (req, res) => {
    await Course.findByIdAndUpdate(req.body.id, req.body).lean()
    res.redirect('/courses')
})

router.post('/remove', routeProtector, async (req, res) => {
    try {
        await Course.findByIdAndRemove(req.body.id).lean()
    } catch (err) {
        console.log(err)
    }

    res.redirect('/courses')
})

router.get('/:id/edit', routeProtector, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const course = await Course.findById(req.params.id).lean()

    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

module.exports = router
