const { v4 } = require('uuid')
const fs = require('fs')
const path = require('path')

class Course {
    constructor(title, price, img) {
        this.id = v4()
        this.title = title
        this.price = price
        this.img = img
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            price: this.price,
            img: this.img
        }
    }

    async save() {
        const courses = await Course.getAll()
        courses.push(this.toJSON())

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) reject(err)

                    resolve()
                }
            )
        })
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err, content) => {
                    if (err) reject(err)

                    resolve(JSON.parse(content))
                })
        })
    }

    static async getById(id) {
        const courses = await Course.getAll()

        return courses.find(item => item.id === id)
    }

    static async update(course) {
        const courses = await Course.getAll()
        const index = courses.findIndex(item => item.id === course.id)

        courses[index] = course

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) reject(err)

                    resolve()
                }
            )
        })
    }
}

module.exports = Course
