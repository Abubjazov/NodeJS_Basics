module.exports = function (toEmail) {
    return {
        to: toEmail,
        from: process.env.SENDERS_EMAIL,
        subject: `Account < ${toEmail} > created successfully`,
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
