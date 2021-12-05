const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('add-course', {
        title: 'Add course',
        isAddCourse: true
    })
})

module.exports = router
