const { path } = require('express/lib/application');
const nodemailer = require('nodemailer');
require("dotenv").config();
const hsb = require('nodemailer-express-handlebars');


const transport = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT),
        secure: false, 
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
     
});

transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));

module.exports = transport;