const { Router } = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', async (req, res) => {
    const courses = await Course.find().lean()

    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    })
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).lean()

    res.render('course', {
        layout: 'course',
        title: `${course.title}`,
        course
    })
})

router.post('/edit', async (req, res) => {
    await Course.findByIdAndUpdate(req.body.id, req.body).lean()
    res.redirect('/courses')
})

router.post('/remove', async (req, res) => {
    try {
        await Course.findByIdAndRemove(req.body.id).lean()
    } catch (err) {
        console.log(err)
    }

    res.redirect('/courses')
})

router.get('/:id/edit', async (req, res) => {
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
