const express = require('express')
const exhbs = require('express-handlebars')
const app = express()
const mainRoutes = require('./routes/main')
const coursesRoutes = require('./routes/courses')
const addCourseRoutes = require('./routes/add-course')
const cartRoutes = require('./routes/cart')

const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use('/', mainRoutes)
app.use('/courses', coursesRoutes)
app.use('/add-course', addCourseRoutes)
app.use('/cart', cartRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})
