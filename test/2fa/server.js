const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); 
const {Vonage} = require('@vonage/server-sdk');

const authMiddleware = require('./routes/auth/authMiddleware');
const { port, gmailUser, gmailPass, vonageKey, vonageSecret } = require("./config/env");
const { generateToken } = require("./service/jwt");

const app = express();

app.use(cors());
app.use(express.json());

const vonage = new Vonage({
  apiKey: vonageKey,
  apiSecret: vonageSecret
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass
  }
});

// a metre en db et crypter
const clients_password = new Map(); 
const clients_phone = new Map();
const clients_email = new Map();
const clients_method_2fa = new Map();
const code_tmp_2fa = new Map();
const code_totp_2fa = new Map();

//----------------
//  Login
//----------------

const loginRoutes = require('./routes/sign/sign')({ vonage, transporter, clients_password, clients_phone, clients_email, clients_method_2fa, code_tmp_2fa });
app.use('/sign', loginRoutes);

//----------------
//  SMS 2FA
//----------------

const smsRoutes = require('./routes/2fa/sms')({ vonage, clients_phone, clients_method_2fa, code_tmp_2fa, generateToken });
app.use('/sms', smsRoutes);

//----------------
//  Email 2FA
//----------------

const emailRoutes = require('./routes/2fa/email')({ transporter, clients_email, clients_method_2fa, code_tmp_2fa, generateToken });
app.use('/email', emailRoutes);

//----------------
//  TOTP 2FA
//----------------

const totpRoutes = require('./routes/2fa/totp')({ clients_method_2fa, code_totp_2fa, generateToken });
app.use('/totp', totpRoutes);

//----------------
//  PROFIL
//----------------

app.post('/profil', authMiddleware, (req, res) => {

  res.json({ success: true, message: 'Accès autorisé au profil', user: req.user });

});

//----------------
//  Start
//----------------

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
