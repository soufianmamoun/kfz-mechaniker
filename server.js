require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Optional: { origin: 'https://deine-frontend-url.com' }
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Für FormData falls nötig

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // App-Passwort von Google
  }
});

// POST Endpoint zum Senden von E-Mails
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ status: 'error', message: 'Bitte alle Felder ausfüllen!' });
  }

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
