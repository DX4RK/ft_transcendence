const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');
const cors = require('cors'); 
const {Vonage} = require('@vonage/server-sdk');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const vonage = new Vonage({
  apiKey: '32d4e479',
  apiSecret: '4RTgGmv1fo3wIlws'
});

// Maps pour stocker les infos temporaires
const emailCode = new Map();
const smsCode = new Map();
const totpCode = new Map();

//----------------
//  Email 2FA
//----------------
app.post('/email/send', async (req, res) => {
  const { login, email } = req.body;
  if (!email) return res.status(400).json({ success:false, message:'Email requis' });

  const code = Math.floor(100000 + Math.random() * 900000);

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: /*process.env.GMAIL_USER*/'fttranscendence03@gmail.com',
        pass: /*process.env.GMAIL_PASS*/'rqws vbkc xjyl mcoe'
      }
    });

    let info = await transporter.sendMail({
      from: '"Mon Site 👤" <fttranscendence03@gmail.com>',
      to: email,
      subject: 'Code de vérification 2FA',
      text: `Bonjour ${login}, votre code de vérification est : ${code}`,
      html: `<b>Bonjour ${login},</b><br>Votre code de vérification est : <strong>${code}</strong>`
    });

    emailCode.set(email, code);
    setTimeout(() => emailCode.delete(email), 5 * 60 * 1000);

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.json({ success: false, message: 'Erreur lors de l’envoi de l’e-mail' });
  }
});


app.post('/email/verify', (req, res) => {
  const { login, email, code } = req.body;
  const expectedCode = emailCode.get(email);

  if (Number(code) === expectedCode) {
    emailCode.delete(email);

    const token = jwt.sign({ userLogin: login, userEmail: email }, /*process.env.JWT_SECRET*/'c4d33a89a49710c12fce5a7d272f470a82ddd04b7680f46529514fce5ad41905', { expiresIn: '7d' });

    return res.json({ success: true, token });
  }

  res.json({ success: false });
});


//----------------
//  SMS 2FA
//----------------
app.post('/sms/send', async (req, res) => {
  const { login, phone } = req.body;
  if (!phone) return res.status(400).json({ success:false, message:'Téléphone requis' });

  const code = Math.floor(100000 + Math.random() * 900000);

  try {
    const response = await vonage.sms.send({
      to: phone,
      from: '2FA-Test',  // Nom court ou numéro Vonage acheté
      text: `Bonjour ${login}, votre code de vérification est ${code}`
    });

    smsCode.set(phone, code);
    setTimeout(() => smsCode.delete(phone), 5 * 60 * 1000);

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur SMS :", err);
    res.json({ success: false, message: 'Erreur lors de l’envoi du SMS' });
  }
});

app.post('/sms/verify', (req, res) => {
  const { login, phone, code } = req.body;
  const expectedCode = smsCode.get(phone);

  if (Number(code) === expectedCode) {
    smsCode.delete(phone);
    const token = jwt.sign({ userLogin: login, userPhone: phone }, /*process.env.JWT_SECRET*/'c4d33a89a49710c12fce5a7d272f470a82ddd04b7680f46529514fce5ad41905', { expiresIn: '7d' });
    return res.json({ success: true, token });
  }
  res.json({ success: false });
});

//----------------
//  TOTP 2FA
//----------------
app.post('/totp/send', async (req, res) => {
  const { login } = req.body;
  if (!login) return res.status(400).json({ success: false, message: 'Login requis' });

  // Si le secret existe déjà, ne pas en régénérer un
  let userSecret = totpCode.get(login);
  if (!userSecret) {
    const secret = speakeasy.generateSecret({ length: 20, name: `MonSite (${login})` });
    userSecret = secret.base32;
    totpCode.set(login, userSecret);

    // Générer QR Code
    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) return res.json({ success: false, message: 'Erreur QR Code' });

      res.json({
        success: true,
        qrCode: data_url,
        secret: secret.base32
      });
    });
  } else {
    res.json({ success: true, message: '2FA déjà configuré pour cet utilisateur' });
  }
});

app.post('/totp/verify', (req, res) => {
  const { login, code } = req.body;
  const userSecret = totpCode.get(login);

  if (!userSecret) return res.json({ success: false, message: 'Pas de secret pour cet utilisateur' });

  const verified = speakeasy.totp.verify({
    secret: userSecret,
    encoding: 'base32',
    code,
    window: 3 // tolérance de 60s
  });

  if (verified) {
    const jwtToken = jwt.sign({ userLogin: login }, /*process.env.JWT_SECRET*/'c4d33a89a49710c12fce5a7d272f470a82ddd04b7680f46529514fce5ad41905', { expiresIn: '7d' });
    return res.json({ success: true, token: jwtToken });
  }

  res.json({ success: false, message: 'Code invalide' });
});



//----------------
//  PROFIL
//----------------
app.post('/profil', authMiddleware, (req, res) => {

  res.json({ success: true, message: 'Accès autorisé au profil', user: req.user });

});


app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
