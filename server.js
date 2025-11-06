require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST Endpoint zum Senden von E-Mails
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `Neue Nachricht von ${name}`,
    text: message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email gesendet:', info.response);
    res.json({ status: 'success', message: 'Nachricht erfolgreich gesendet!' });
  } catch (err) {
    console.error('Fehler beim Versenden:', err);
    res.status(500).json({ status: 'error', message: 'Fehler beim Senden der Nachricht' });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
