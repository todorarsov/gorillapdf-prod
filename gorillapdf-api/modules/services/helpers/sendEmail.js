
module.exports = function(from, subject, body) {
   const nodemailer = require("nodemailer");
  let transporter = nodemailer.createTransport({
    host: "gorillapdf.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'gorilla@gorillapdf.com', // generated ethereal user
      pass: 'U&j85ho1', // generated ethereal password
    },
	 tls:{
        rejectUnauthorized: false
    }
  });

    this.sendEmail = function(res) {
        try {
            let info = transporter.sendMail({
                from: from, // sender address
                to: "gorilla@gorillapdf.com", // list of receivers
                subject: subject, // Subject line
                text: body, // plain text body
                html: body, // html body
              });

              console.log("Message sent: %s", info.messageId);
              return "Message sent!";
        } catch (e) {
            console.log(e);
            return "Message failed!";
        }
    };

}