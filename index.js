const express = require('express')
const exhbs = require('express-handlebars')
const app = express()


const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('main', {
        title: 'Main page',
        isMain: true
    })
})

app.get('/add-course', (req, res) => {
    res.render('add-course', {
        title: 'Add course',
        isAddCourse: true
    })
})

app.get('/courses', (req, res) => {
    res.render('courses', {
        title: 'Courses',
        isCourses: true
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})
