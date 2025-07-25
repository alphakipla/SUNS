const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allows cross-origin requests
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

  // Email content
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

  // Set up Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kalpha3906@gmail.com',
      pass: 'nnnewekhpzaymfpm', // App password
    },
  });

  const mailOptions = {
    from: '"Sunstar Booking" <kalpha3906@gmail.com>',
    to: ['kalphaxide@gmail.com', email], // Hotel and customer
    subject: 'New Booking Request',
    html: emailBody,
    text: `New Booking Request\n\nName: ${customername}\nEmail: ${email}\nPhone: ${phonenumber}\nGuests: ${number}\nRoom: ${room}\nCheck-in: ${checkin}\nCheck-out: ${checkout}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Booking request sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send booking email.', error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
