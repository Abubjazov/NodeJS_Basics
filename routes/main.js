const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('main', {
        title: 'Main page',
        isMain: true
    })
})

module.exports = router
