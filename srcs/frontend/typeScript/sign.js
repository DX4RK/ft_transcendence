var userToken = '';
var userLogin = '';
//----------------
//  GET
//----------------
var profilBtn = document.getElementById('profilBtn');
var signUpPageBtn = document.getElementById('signUpPageBtn');
var signInPageBtn = document.getElementById('signInPageBtn');
var enable2faPageBtn = document.getElementById('enable2faPageBtn');
var signUpPage = document.getElementById('signUpPage');
var loginUp = document.getElementById('loginUp');
var passwordUp = document.getElementById('passwordUp');
var signUpBtn = document.getElementById('signUpBtn');
var closeSignUpPageBtn = document.getElementById('closeSignUpPageBtn');
var signInPage = document.getElementById('signInPage');
var loginIn = document.getElementById('loginIn');
var passwordIn = document.getElementById('passwordIn');
var signInBtn = document.getElementById('signInBtn');
var closeSignInPageBtn = document.getElementById('closeSignInPageBtn');
var all2faPage = document.getElementById('all2faPage');
var sms2faBtn = document.getElementById('sms2faBtn');
var email2faBtn = document.getElementById('email2faBtn');
var totp2faBtn = document.getElementById('totp2faBtn');
var close2faBtn = document.getElementById('close2faBtn');
var sms2faPage = document.getElementById('sms2faPage');
var phone = document.getElementById('phone');
var smsVerify2faBtn = document.getElementById('smsVerify2faBtn');
var closeSms2faPageBtn = document.getElementById('closeSms2faPageBtn');
var smsVerifyCode2faPage = document.getElementById('smsVerifyCode2faPage');
var smsCode2fa = document.getElementById('smsCode2fa');
var smsVerifyCode2faBtn = document.getElementById('smsVerifyCode2faBtn');
var email2faPage = document.getElementById('email2faPage');
var email = document.getElementById('email');
var emailVerify2faBtn = document.getElementById('emailVerify2faBtn');
var closeEmail2faPageBtn = document.getElementById('closeEmail2faPageBtn');
var emailVerifyCode2faPage = document.getElementById('emailVerifyCode2faPage');
var emailCode2fa = document.getElementById('emailCode2fa');
var emailVerifyCode2faBtn = document.getElementById('emailVerifyCode2faBtn');
var totp2faPage = document.getElementById('totp2faPage');
var totp2faQrCode = document.getElementById('totp2faQrCode');
var totpVerify2faBtn = document.getElementById('totpVerify2faBtn');
var closeTotp2faPageBtn = document.getElementById('closeTotp2faPageBtn');
var totpVerifyCode2faPage = document.getElementById('totpVerifyCode2faPage');
var totpCode2fa = document.getElementById('totpCode2fa');
var totpVerifyCode2faBtn = document.getElementById('totpVerifyCode2faBtn');
var profilPage = document.getElementById('profilPage');
var closeProfilPageBtn = document.getElementById('closeProfilPageBtn');
//----------------
//  LOGIN
//----------------
// sign up
signUpPageBtn.addEventListener('click', function () {
    signUpPage.style.display = 'flex';
});
closeSignUpPageBtn.addEventListener('click', function () {
    signUpPage.style.display = 'none';
});
signUpBtn.addEventListener('click', function () {
    var data = {
        login: loginUp.value,
        password: passwordUp.value
    };
    fetch('http://localhost:3000/sign/up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    userLogin = loginUp.value;
    signUpPage.style.display = 'none';
    signUpPageBtn.style.display = 'none';
    signInPageBtn.style.display = 'none';
    enable2faPageBtn.style.display = 'flex';
});
// sign in
signInPageBtn.addEventListener('click', function () {
    signInPage.style.display = 'flex';
});
closeSignInPageBtn.addEventListener('click', function () {
    signInPage.style.display = 'none';
});
signInBtn.addEventListener('click', function () {
    var data = {
        login: loginIn.value,
        password: passwordIn.value
    };
    fetch('http://localhost:3000/sign/in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if (res.success) {
            userLogin = loginIn.value;
            signInPage.style.display = 'none';
            signInPageBtn.style.display = 'none';
            signUpPageBtn.style.display = 'none';
            if (res.method == 'sms')
                smsVerifyCode2faPage.style.display = 'flex';
            else if (res.method == 'email')
                emailVerifyCode2faPage.style.display = 'flex';
            else if (res.method == 'totp')
                totpVerifyCode2faPage.style.display = 'flex';
        }
        else {
            alert('Erreur : ' + res.message);
        }
    })
        .catch(function (err) {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
// enable 2fa
enable2faPageBtn.addEventListener('click', function () {
    all2faPage.style.display = 'flex';
});
close2faBtn.addEventListener('click', function () {
    all2faPage.style.display = 'none';
});
//----------------
//  SMS 2FA
//----------------
sms2faBtn.addEventListener('click', function () {
    all2faPage.style.display = 'none';
    sms2faPage.style.display = 'flex';
});
smsVerify2faBtn.addEventListener('click', function () {
    var data = {
        login: userLogin,
        phone: phone.value
    };
    fetch('http://localhost:3000/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if (res.success) {
            sms2faPage.style.display = 'none';
            smsVerifyCode2faPage.style.display = 'flex';
        }
        else {
            alert('Erreur : ' + res.message);
        }
    })
        .catch(function (err) {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
closeSms2faPageBtn.addEventListener('click', function () {
    sms2faPage.style.display = 'none';
    all2faPage.style.display = 'flex';
});
smsVerifyCode2faBtn.addEventListener('click', function () {
    var data2fa = {
        login: userLogin,
        phone: phone.value,
        code: smsCode2fa.value
    };
    fetch('http://localhost:3000/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data2fa)
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if (res.success) {
            smsVerifyCode2faPage.style.display = 'none';
            enable2faPageBtn.style.display = 'none';
            userToken = res.token;
        }
        else {
            alert('Code incorrect.');
        }
    })
        .catch(function (err) {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
//----------------
//  Email 2FA
//----------------
email2faBtn.addEventListener('click', function () {
    all2faPage.style.display = 'none';
    email2faPage.style.display = 'flex';
});
emailVerify2faBtn.addEventListener('click', function () {
    var data = {
        login: userLogin,
        email: email.value
    };
    fetch('http://localhost:3000/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if (res.success) {
            email2faPage.style.display = 'none';
            emailVerifyCode2faPage.style.display = 'flex';
        }
        else {
            alert('Erreur : ' + res.message);
        }
    })
        .catch(function (err) {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
closeEmail2faPageBtn.addEventListener('click', function () {
    email2faPage.style.display = 'none';
    all2faPage.style.display = 'flex';
});
emailVerifyCode2faBtn.addEventListener('click', function () {
    var data2fa = {
        login: userLogin,
        email: email.value,
        code: emailCode2fa.value
    };
    fetch('http://localhost:3000/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data2fa)
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if (res.success) {
            emailVerifyCode2faPage.style.display = 'none';
            enable2faPageBtn.style.display = 'none';
            userToken = res.token;
        }
        else {
            alert('Erreur : ' + res.message);
        }
    })
        .catch(function (err) {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
//----------------
//  TOTP 2FA
//----------------
totp2faBtn.addEventListener('click', function () {
    var data = {
        login: userLogin
    };
    fetch('http://localhost:3000/totp/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if (res.success) {
            totp2faQrCode.src = res.qrCode;
            totp2faQrCode.style.display = 'block';
            all2faPage.style.display = 'none';
            totp2faPage.style.display = 'flex';
        }
        else {
            alert('Erreur : ' + res.message);
        }
    })
        .catch(function (err) {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
totpVerify2faBtn.addEventListener('click', function () {
    totp2faPage.style.display = 'none';
    totpVerifyCode2faPage.style.display = 'flex';
});
closeTotp2faPageBtn.addEventListener('click', function () {
    totp2faPage.style.display = 'none';
    all2faPage.style.display = 'flex';
});
totpVerifyCode2faBtn.addEventListener('click', function () {
    var data2fa = {
        login: userLogin,
        code: totpCode2fa.value
    };
    fetch('http://localhost:3000/totp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data2fa)
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if (res.success) {
            totpVerifyCode2faPage.style.display = 'none';
            enable2faPageBtn.style.display = 'none';
            userToken = res.token;
        }
        else {
            alert('Erreur : ' + res.message);
        }
    })
        .catch(function (err) {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
//----------------
//  OTHER
//----------------
profilBtn.addEventListener('click', function () {
    fetch('http://localhost:3000/profil', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        },
        body: JSON.stringify({})
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if (res.success) {
            profilPage.style.display = 'flex';
        }
        else {
            alert('Movais token JWT !');
        }
    });
});
closeProfilPageBtn.addEventListener('click', function () {
    profilPage.style.display = 'none';
});
