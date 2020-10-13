const { config } = require('./setup');

const emailMaker = {};

emailMaker.transport = {
  host: config.emailHost,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.emailAuthUser, // generated ethereal user
    pass: config.emailAuthPassword, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
};

emailMaker.makeEmailParams = (from, to, subject, text, html) => {
  return {
    from: `"${from}" <${config.emailfromAddress}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  };
};

emailMaker.makeSignupEmailBody = (user, verificationUrl) => {
  return `
  <p>Thanks for signing up - Here's your verification Email</p>
  <h3>Signup details</h3>
  <ul>
  <li>First Name: ${user.firstname}</li>
  <li>Last Name: ${user.lastname}</li>
  <li>Email: ${user.email}</li>
  <li>Username: ${user.username}</li>
  </ul>
  <h3>Verfication Link</h3>
  <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
  `;
};

emailMaker.makeSignupEmailTextOnly = (user, verificationUrl) => {
  return `
  Thanks for signing up - Here's your verification Email\n
  Signup details\n\n

  First Name: ${user.firstname}\n
  Last Name: ${user.lastname}\n
  Email: ${user.email}\n
  Username: ${user.username}\n
  
  Verfication Link\n
  (you can copy and paste this link in a browser)\n\n
  ${verificationUrl}
  `;
};

module.exports = { emailMaker };
