const path = require('path')
const fs = require('fs')

const cartPath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
)
class Cart {
    static async add(course) {
        const cart = await Cart.fetch()

        const index = cart.courses.findIndex(item => item.id === course.id)
        const candidate = cart.courses[index]

        if (candidate) {
            candidate.count++
            cart.courses[index] = candidate
        } else {
            course.count = 1
            cart.courses.push(course)
        }

        cart.price += +course.price

        return new Promise((resolve, reject) => {
            fs.writeFile(cartPath, JSON.stringify(cart), err => {
                if (err) reject(err)

                resolve()
            })
        })
    }

    static async remove(id) {
        const cart = await Cart.fetch()

        const index = cart.courses.findIndex(item => item.id === id)
        const course = cart.courses[index]

        if (course.count === 1) {
            cart.courses = cart.courses.filter(item => item.id !== id)
        } else {
            cart.courses[index].count--
        }

        cart.price -= +course.price

        return new Promise((resolve, reject) => {
            fs.writeFile(cartPath, JSON.stringify(cart), err => {
                if (err) reject(err)

                resolve(cart)
            })
        })

    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(cartPath, 'utf-8', (err, data) => {
                if (err) reject(err)

                resolve(JSON.parse(data))
            })
        })
    }

}

module.exports = Cart
