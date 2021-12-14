module.exports = function (user) {
    return {
        to: user.email,
        subject: `Account < ${user.email} > access recovery. Token: ${user.resetToken}`,
        from: process.env.SENDER_EMAIL,
        html: `
            <h1>Access recovery</h1>
            <hr />
            <p>The system received a password recovery request. If you haven't, just ignore this letter.</p>
            <p>Otherwise, follow this link: <strong><a href="${process.env.BASE_URL}/auth/password/${user.resetToken}">Recovery Access</a></strong></p>
            <hr />
            <a href="${process.env.BASE_URL}">SuperCourseStore - SCS Ltd.</a>
        `
    }
}
