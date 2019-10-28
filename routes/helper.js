
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const helper = {};

let transport = nodemailer.createTransport({
	host: 'in-v3.mailjet.com',
	port: 587,
	auth: {
		user: 'd269a4629f1a45275d2a31a9ca371e86',
		pass: '79976992e7a0233ca401e27caeb0ee2c'
	}
});



helper.sendMail = (to, subject, text) => {
	const message = {
		from: 'mimo.insignia@gmail.com', // Sender address
		to: to,         // List of recipients
		subject: subject, // Subject line
		text: text // Plain text body
	};
	transport.sendMail(message, function (err, info) {
		if (err) {
			console.log(err)
		} else {
			console.log(info);
		}
	});
};

module.exports = helper;
