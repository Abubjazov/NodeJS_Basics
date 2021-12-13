module.exports = function (toEmail) {
    return {
        to: toEmail,
        subject: `Account < ${toEmail} > created successfully`,
        from: process.env.SENDER_EMAIL,
        html: `
            <h1>Welcome to our store</h1>
            <hr />
            <p>Congratulations! )</p>
            <p>Your accaunt < ${toEmail} > created successfully!</p>
            <hr />
            <a href="${process.env.BASE_URL}">SuperCourseStore - SCS Ltd.</a>
        `
    }
}
