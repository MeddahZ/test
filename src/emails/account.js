const sgMail = require('@sendgrid/mail')
const sendGridAPIKey = process.env.SENDGRID

sgMail.setApiKey(sendGridAPIKey)

sgMail.send({
    to: 'hafsamdh18@gmail.com',
    from: 'andrew@mead.io',
    subject: 'first email',
    text: 'howdy madlass.'
})