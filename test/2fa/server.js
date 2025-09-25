const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');
const cors = require('cors'); 
const {Vonage} = require('@vonage/server-sdk');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

const vonage = new Vonage({
  apiKey: '32d4e479',
  apiSecret: '4RTgGmv1fo3wIlws'
});

// a metre en db et crypter
const clients_password = new Map(); 
const clients_phone = new Map();
const clients_email = new Map();
const clients_method_2fa = new Map();
const code_tmp_2fa = new Map();

//----------------
//  Login
//----------------

  // sign in

app.post('/signIn', async (req, res) => {
  const { login, password } = req.body;

  if (clients_password.has(login)) return res.status(400).json({ success: false, message: 'Utilisateur déjà inscrit' });

  clients_password.set(login, password);

  res.json({ success: true });
});

  // sign up

app.post('/signUp', async (req, res) => {
  const { login, password } = req.body;
  const expected_password = clients_password.get(login);
  const method = clients_method_2fa.get(login);

  if (password !== expected_password) return res.status(401).json({ success: false, message: 'Mot de pass incorect' });
  
  try {
    if (method === 'sms') { // sms

      const code = Math.floor(100000 + Math.random() * 900000);

      const phone = clients_phone.get(login);
      const response = await vonage.sms.send({
        to: phone,
        from: '2FA-Test',
        text: `Bonjour ${login}, votre code de vérification est ${code}`
      });

      code_tmp_2fa.set(phone, code);
      setTimeout(() => code_tmp_2fa.delete(phone), 5 * 60 * 1000);

    } else if (method === 'email') { // email

      const code = Math.floor(100000 + Math.random() * 900000);

      const email = clients_email.get(login);
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

      code_tmp_2fa.set(email, code);
      setTimeout(() => code_tmp_2fa.delete(email), 5 * 60 * 1000);

    } else if (method === 'totp') { // totp
      ;
    } else
      return res.json({ success: false, message: 'Pas de metode de 2fa' });

    return res.json({ success: true, method: method }); 

  } catch (err) {
      console.error("Erreur serveur :", err);
      return res.json({ success: false, message: 'Erreur lors de l’envoi du code' });
  }

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
      from: '2FA-Test',
      text: `Bonjour ${login}, votre code de vérification est ${code}`
    });

    code_tmp_2fa.set(phone, code);
    setTimeout(() => code_tmp_2fa.delete(phone), 5 * 60 * 1000);

    res.json({ success: true });

  } catch (err) {
    console.error("Erreur SMS :", err);
    res.json({ success: false, message: 'Erreur lors de l’envoi du SMS' });
  }
});

app.post('/sms/verify', (req, res) => {
  const { login, phone, code } = req.body;
  const expectedCode = code_tmp_2fa.get(phone);

  if (!expectedCode) return res.json({ success: false, message: 'Pas de secret pour cet utilisateur' });


  if (Number(code) === expectedCode) {
    code_tmp_2fa.delete(phone);

    const token = jwt.sign({ userLogin: login, userPhone: phone }, /*process.env.JWT_SECRET*/'c4d33a89a49710c12fce5a7d272f470a82ddd04b7680f46529514fce5ad41905', { expiresIn: '7d' });
   
    clients_method_2fa.set(login, "sms");
    clients_phone.set(login, phone);

    return res.json({ success: true, token });
  }
  res.json({ success: false });
});

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

    code_tmp_2fa.set(email, code);
    setTimeout(() => code_tmp_2fa.delete(email), 5 * 60 * 1000);

    res.json({ success: true });

  } catch (err) {
    console.error("Erreur serveur :", err);
    res.json({ success: false, message: 'Erreur lors de l’envoi de l’e-mail' });
  }
});

app.post('/email/verify', (req, res) => {
  const { login, email, code } = req.body;
  const expectedCode = code_tmp_2fa.get(email);

  if (!expectedCode) return res.json({ success: false, message: 'Pas de secret pour cet utilisateur' });

  if (Number(code) === expectedCode) {
    code_tmp_2fa.delete(email);

    const token = jwt.sign({ userLogin: login, userEmail: email }, /*process.env.JWT_SECRET*/'c4d33a89a49710c12fce5a7d272f470a82ddd04b7680f46529514fce5ad41905', { expiresIn: '7d' });

    clients_method_2fa.set(login, "email");
    clients_email.set(login, email);

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

  try {
    let userSecret = code_tmp_2fa.get(login);

    if (!userSecret) {
      const secret = speakeasy.generateSecret({ length: 20, name: login, issuer: "2FA-Test" });
      userSecret = secret.base32;
      code_tmp_2fa.set(login, userSecret);

      qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) return res.json({ success: false, message: 'Erreur QR Code' });

        res.json({ success: true, qrCode: data_url, secret: secret.base32 });

      });
    } else {
      res.json({ success: true, message: '2FA déjà configuré pour cet utilisateur' });
    }
  } catch (err) {
    console.error("Erreur TOTP :", err);
    res.json({ success: false, message: 'Erreur lors de l’envoi TOTP' });
  }
});

app.post('/totp/verify', (req, res) => {
  const { login, code } = req.body;
  const expectedCode = code_tmp_2fa.get(login);

  if (!expectedCode) return res.json({ success: false, message: 'Pas de secret pour cet utilisateur' });

  const verified = speakeasy.totp.verify({
    secret: expectedCode,
    encoding: 'base32',
    token: code,
    window: 1
  });

  if (verified) {
    const jwtToken = jwt.sign({ userLogin: login }, /*process.env.JWT_SECRET*/'c4d33a89a49710c12fce5a7d272f470a82ddd04b7680f46529514fce5ad41905', { expiresIn: '7d' });
    
    clients_method_2fa.set(login, "totp");

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

//----------------
//  Start
//----------------

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
