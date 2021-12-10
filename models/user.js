const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function (course) {
    const index = this.cart.items.findIndex(item => item.courseId.toString() === course._id.toString())

    if (index >= 0) {
        this.cart.items[index].count += 1
    } else {
        this.cart.items.push({
            count: 1,
            courseId: course._id
        })
    }
    return this.save()
}

module.exports = model('User', userSchema)
