// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'labassist'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Configure nodemailer to send emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noman12@gmail.com',
    pass: '' // Add your Gmail app password here
  }
});

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Endpoint to send OTP to the user's email
app.post('/send-otp', (req, res) => {
  const email = req.body.email; // Assuming email is sent in the request body
  const otp = generateOTP();
  
  // Save the OTP to the database
  const sql = 'INSERT INTO otps (email, otp) VALUES (?, ?)';
  connection.query(sql, [email, otp], (err, result) => {
    if (err) {
      console.error('Error saving OTP to database: ' + err.message);
      res.status(500).send('Error sending OTP');
      return;
    }
    
    // Send OTP to user's email
    const mailOptions = {
      from: 'noman12@gmail.com',
      to: email,
      subject: 'Your OTP for verification',
      text: `Your OTP is: ${otp}`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ' + error.message);
        res.status(500).send('Error sending OTP');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('OTP sent successfully');
      }
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
