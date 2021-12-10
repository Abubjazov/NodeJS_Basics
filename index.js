require('dotenv').config()
const path = require('path')
const express = require('express')
const exhbs = require('express-handlebars')
const mongo = require('mongoose')

const app = express()

const User = require('./models/user')

const mainRoutes = require('./routes/main')
const coursesRoutes = require('./routes/courses')
const addCourseRoutes = require('./routes/add-course')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')

const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        req.user = await User.findById(process.env.USER_ID)
        next()
    } catch (err) {
        console.log(err)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use('/', mainRoutes)
app.use('/courses', coursesRoutes)
app.use('/add-course', addCourseRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)

const PORT = process.env.PORT || 3000
const URL = process.env.DB_URL

async function start() {
    try {
        await mongo.connect(URL, { useNewUrlParser: true })

        const candidate = await User.findOne()

        if (!candidate) {
            const user = new User({
                email: 'test@mail.ru',
                name: 'User1',
                cart: { items: [] }
            })

            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()
