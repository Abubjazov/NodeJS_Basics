const { Router } = require('express')
const Course = require('../models/course')
const User = require('../models/user')
const router = Router()

function mapCartItems(cart) {
    return cart.items.map(item => ({
        ...item.courseId._doc, count: item.count
    }))
}

function computePrice(courses) {
    return courses.reduce((total, item) => {
        return total += item.price * item.count
    }, 0)
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)

    await req.user.addToCart(course)
    res.redirect('/cart')
})

router.get('/', async (req, res) => {
    const user = await req.user.populate('cart.items.courseId')

    const courses = mapCartItems(user.cart)

    res.render('cart', {
        title: 'Shopping cart',
        isCart: true,
        courses,
        price: computePrice(courses)
    })
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id)

    const user = await req.user.populate('cart.items.courseId')
    const courses = mapCartItems(user.cart)
    const cart = {
        courses,
        price: computePrice(courses)
    }

    res.status(200).json(cart)
})

module.exports = router
