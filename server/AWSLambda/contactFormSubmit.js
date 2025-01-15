const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  try {
    // Parse the request body from the event
    const { name, email, message } = JSON.parse(event.body);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'beau@nationalautohub.com',
        pass: 'cjyo osuo ebfj knvz',
      },
    });

    let mailOptions = {
      from: 'beau@nationalautohub.com',
      to: 'beau@nationalautohub.com',
      subject: 'New Contact Submission',
      text: `${name} just sent a submission!\n\nEmail: ${email}\n\nMessage:\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    // Return success response with CORS headers
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

    // Return error response with CORS headers
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "OPTIONS, POST", // Allow OPTIONS and POST methods
        "Access-Control-Allow-Headers": "Content-Type" // Allow Content-Type header
      },
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
