const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST /reserve - Handle form submissions
app.post('/reserve', async (req, res) => {
  const {
    customername,
    email,
    checkin,
    checkout,
    room,
    number,
    phonenumber
  } = req.body;

  const emailBody = `
    <h3>New Booking Request Received</h3>
    <p><strong>Name:</strong> ${customername}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone Number:</strong> ${phonenumber}</p>
    <p><strong>Guests:</strong> ${number}</p>
    <p><strong>Room:</strong> ${room}</p>
    <p><strong>Check-in:</strong> ${checkin}</p>
    <p><strong>Check-out:</strong> ${checkout}</p>
  `;

  // Setup transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kalpha3906@gmail.com',
      pass: 'nnnewekhpzaymfpm', // Gmail App Password
    },
  });

  const mailOptions = {
    from: '"Sunstar Booking" <kalpha3906@gmail.com>',
    to: ['kalphaxide@gmail.com', email],             // Hotel + customer
    cc: 'info@sunstarresort.co.ke',            // Add actual management email
    subject: 'New Booking Request',
    html: emailBody,
    text: `New Booking Request\n\nName: ${customername}\nEmail: ${email}\nPhone: ${phonenumber}\nGuests: ${number}\nRoom: ${room}\nCheck-in: ${checkin}\nCheck-out: ${checkout}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    // ✅ Redirect to confirmation page on success
    res.redirect('https://sunstarresort.co.ke/confirmation/');
  } catch (error) {
    console.error('Email error:', error);
    // ❌ Send simple error HTML page with a retry button
    res.status(500).send(`
      <html>
        <head>
          <title>Booking Failed</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f8f8f8;
              padding: 40px;
              text-align: center;
              color: #333;
            }
            .button {
              background: #007bff;
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 6px;
              text-decoration: none;
              margin-top: 20px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <h2>Oops! Something went wrong.</h2>
          <p>Please try booking again. If the issue persists, contact us directly.</p>
          <a href="https://sunstarresort.co.ke/reserve.php" class="button">Book Again</a>
        </body>
      </html>
    `);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
