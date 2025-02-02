const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const app = express();
const prisma = new PrismaClient();

const cors = require('cors');
app.use(cors({
  origin: 'https://accredian-frontend-seven.vercel.app', // This should match the frontend origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

// Send Referral Email
const sendReferralEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',

   port: 465,
   secure: true,
   auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
   }
  });

   
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: data.friendsEmail,
    subject: 'Referral Submission',
    text: `You have been referred by ${data.yourName} (${data.yourEmail}) for course ID: ${data.courseId}.`
  };

  try {
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

app.get('/referrals', async (req, res) => {
  try {
    const referrals = await prisma.referral.findMany();
    res.json(referrals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving referrals' });
  }
});

// POST /referrals - Create a new referral
app.post('/referrals', async (req, res) => {
  const { yourName, yourEmail, friendsName, friendsEmail, courseId } = req.body;

  // Validation
  if (!yourName || !yourEmail || !friendsName || !friendsEmail || !courseId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create referral in the database
    const referral = await prisma.referral.create({
      data: { yourName, yourEmail, friendsName, friendsEmail, courseId }
    });

    // Send referral email
    await sendReferralEmail({ yourName, yourEmail, friendsName, friendsEmail, courseId });

    res.status(201).json(referral);
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
