const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Parse the request body from the event
  const { name, email, phone, message, services } = JSON.parse(event.body);

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'beau@nationalautohub.com',
      pass: 'cjyo osuo ebfj knvz',
    },
  });

  let mailOptions = {
    from: 'no-reply@hartecho.com',
    to: 'beau@nationalautohub.com',
    subject: 'New Q Submission',
    text: `${name} just sent a submission!\n\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n\n${message}\n\nServices: ${services.join(', ')}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "OPTIONS, POST", // Allow OPTIONS and POST methods
        "Access-Control-Allow-Headers": "Content-Type" // Allow Content-Type header
      },
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email', error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Error sending email' }),
    };
  }
};
