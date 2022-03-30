const path = require('path');
const nodemailer = require('nodemailer');
require("dotenv").config();
const hbs = require('nodemailer-express-handlebars');


const transport = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
     
});

transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./src/resources/mail/')
      },
      viewPath: path.resolve('./src/resources/mail'),
      extName: '.html'
}));

module.exports = transport;