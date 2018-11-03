const functions = require('firebase-functions');
const nodemailer = require('nodemailer')
const postmarkTransport = require('nodemailer-postmark-transport')

//obtain key from postmark
const postmarkKey = 'foo'
const mailTransport = nodemailer.createTransport(postmarkTransport({
    auth: {
        apiKey: postmarkKey
    }
}))

module.exports = {

    createUser: functions.firestore
        .document('user/{toDoId}')
        .onCreate((snap, context) => {
            const snapshot = event.data
            const user = snapshot.val()
            // Use nodemailer to send email
            return sendEmail(user);

        })

}

function sendEmail(user) {
    // 5. Send welcome email to new users
    const mailOptions = {
        from: '"Dave" <dave@example.net>',
        to: '${user.email}',
        subject: 'Welcome!',
        html: `<YOUR-WELCOME-MESSAGE-HERE>`
    }
    // 6. Process the sending of this email via nodemailer
    return mailTransport.sendMail(mailOptions)
        .then(() => console.log('dbCompaniesOnUpdate:Welcome confirmation email'))
        .catch((error) => console.error('There was an error while sending the email:', error))
}