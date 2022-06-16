const nodemailer = require("nodemailer");

exports.mailer = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  //*--------------------* create reusable transporter object using the default SMTP transport *--------------------* //
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL, //^ generated ethereal user
      pass: process.env.EMAIL_SECRATE_WEB, //^ generated ethereal password
    },
  });

  //*--------------------* send mail with defined transport object *--------------------*//
  let info = await transporter.sendMail({
    from: process.env.EMAIL, //^ sender address
    to: req.email, //^ list of receivers
    subject: `Your login credentials by Company Search.`, //^ Subject line
    text: `This mail is Company Search.`, //^ plain text body
    html: `
            <h3>Hello,</h3>
            <h3>Your login credentials.</h3>
            <br/>
            <h3><span style=" margin-right: 5px;">Email:</span><span>${req.email}</span></h3>
            <h3><span style=" margin-right: 5px;">Password:</span><span>${req.password}</span></h3>
            <br/>
            <a 
                href="https://localhost:3000" 
                style="
                    border: 1px solid black; 
                    padding: 5px 30px; 
                    border-radius: 5px; 
                    background: rgb(33, 47, 61); 
                    color: white; 
                    text-align:center; 
                    text-decoration: none;"
            >
                Login Now
            </a>
        `,
  });

  return info;
};
