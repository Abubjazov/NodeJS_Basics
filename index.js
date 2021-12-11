require('dotenv').config()
const path = require('path')
const express = require('express')
const exhbs = require('express-handlebars')
const mongo = require('mongoose')
const session = require('express-session')

const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const app = express()

const User = require('./models/user')
const varMiddleware = require('./middleware/variables')

const mainRoutes = require('./routes/main')
const coursesRoutes = require('./routes/courses')
const addCourseRoutes = require('./routes/add-course')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SECRET || 'some secret value',
    resave: false,
    saveUninitialized: false
}))
app.use(varMiddleware)

app.use('/', mainRoutes)
app.use('/courses', coursesRoutes)
app.use('/add-course', addCourseRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

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
