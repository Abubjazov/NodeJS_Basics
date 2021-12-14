const { Router } = require('express')
const Course = require('../models/course')
const router = Router()
const routeProtector = require('../middleware/route-protector')

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString()
}

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
    try {
        const course = await Course.findById(req.body.id).lean()

        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        await Course.findByIdAndUpdate(req.body.id, req.body).lean()
        res.redirect('/courses')

    } catch (err) {
        console.log(err)
    }

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

    try {
        const course = await Course.findById(req.params.id).lean()

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
