const { Router } = require('express')
const Cart = require('../models/cart')
const Course = require('../models/course')
const router = Router()

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id).lean()
    await Cart.add(course)
    res.redirect('/cart')
})

router.get('/', async (req, res) => {
    const cart = await Cart.find().lean()

    res.render('cart', {
        title: 'Shopping cart',
        isCart: true,
        courses: cart.courses,
        price: cart.price
    })
})

router.delete('/remove/:id', async (req, res) => {
    const cart = await Cart.remove(req.params.id)

    res.status(200).json(cart)
})

module.exports = router
