const { Router } = require('express')
const Course = require('../models/course')
const router = Router()
const { validationResult } = require('express-validator')
const { courseValidators } = require('../utils/validators')
const routeProtector = require('../middleware/route-protector')

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('userId', 'email name')

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
    try {
        const course = await Course.findById(req.params.id)

        res.render('course', {
            layout: 'course',
            title: `${course.title}`,
            course
        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/edit', routeProtector, courseValidators, async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${req.body.id}/edit?allow=true`)
    }

    try {
        const course = await Course.findById(req.body.id)

        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        await Course.findByIdAndUpdate(req.body.id, req.body)
        res.redirect('/courses')

    } catch (err) {
        console.log(err)
    }

})

router.post('/remove', routeProtector, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })

        res.redirect('/courses')
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id/edit', routeProtector, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const course = await Course.findById(req.params.id)

        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title: `Edit ${course.title}`,
            course
        })

    } catch (err) {
        console.log(err)
    }
})

module.exports = router
