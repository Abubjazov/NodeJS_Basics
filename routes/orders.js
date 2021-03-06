const { Router } = require('express')
const Order = require('../models/order')
const router = Router()
const routeProtector = require('../middleware/route-protector')

router.get('/', routeProtector, async (req, res) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id })
            .populate('user.userId')

        res.render('orders', {
            title: 'Orders',
            isOrders: true,
            orders: orders.map(order => ({
                ...order._doc,
                price: order.courses.reduce((total, item) => {
                    return total += item.course.price * item.count
                }, 0)
            }))
        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/', routeProtector, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId')
        const filteredCourses = user.cart.items.filter(item => item.courseId !== null) //TODO: Problem with courses deleted from DB/courses

        const courses = filteredCourses.map(item => ({
            count: item.count,
            course: { ...item.courseId._doc }
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user._id
            },
            courses
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
