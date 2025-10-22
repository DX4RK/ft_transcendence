let userLogin = '';
//----------------
//  GET
//----------------
const profilBtn = document.getElementById('profilBtn');
const signUpPageBtn = document.getElementById('signUpPageBtn');
const signInPageBtn = document.getElementById('signInPageBtn');
const enable2faPageBtn = document.getElementById('enable2faPageBtn');
const signUpPage = document.getElementById('signUpPage');
const loginUp = document.getElementById('loginUp');
const passwordUp = document.getElementById('passwordUp');
const signUpBtn = document.getElementById('signUpBtn');
const closeSignUpPageBtn = document.getElementById('closeSignUpPageBtn');
const signInPage = document.getElementById('signInPage');
const loginIn = document.getElementById('loginIn');
const passwordIn = document.getElementById('passwordIn');
const signInBtn = document.getElementById('signInBtn');
const closeSignInPageBtn = document.getElementById('closeSignInPageBtn');
const all2faPage = document.getElementById('all2faPage');
const sms2faBtn = document.getElementById('sms2faBtn');
const email2faBtn = document.getElementById('email2faBtn');
const totp2faBtn = document.getElementById('totp2faBtn');
const close2faBtn = document.getElementById('close2faBtn');
const sms2faPage = document.getElementById('sms2faPage');
const phone = document.getElementById('phone');
const smsVerify2faBtn = document.getElementById('smsVerify2faBtn');
const closeSms2faPageBtn = document.getElementById('closeSms2faPageBtn');
const smsVerifyCode2faPage = document.getElementById('smsVerifyCode2faPage');
const smsCode2fa = document.getElementById('smsCode2fa');
const smsVerifyCode2faBtn = document.getElementById('smsVerifyCode2faBtn');
const email2faPage = document.getElementById('email2faPage');
const email = document.getElementById('email');
const emailVerify2faBtn = document.getElementById('emailVerify2faBtn');
const closeEmail2faPageBtn = document.getElementById('closeEmail2faPageBtn');
const emailVerifyCode2faPage = document.getElementById('emailVerifyCode2faPage');
const emailCode2fa = document.getElementById('emailCode2fa');
const emailVerifyCode2faBtn = document.getElementById('emailVerifyCode2faBtn');
const totp2faPage = document.getElementById('totp2faPage');
const totp2faQrCode = document.getElementById('totp2faQrCode');
const totpVerify2faBtn = document.getElementById('totpVerify2faBtn');
const closeTotp2faPageBtn = document.getElementById('closeTotp2faPageBtn');
const totpVerifyCode2faPage = document.getElementById('totpVerifyCode2faPage');
const totpCode2fa = document.getElementById('totpCode2fa');
const totpVerifyCode2faBtn = document.getElementById('totpVerifyCode2faBtn');
const profilPage = document.getElementById('profilPage');
const closeProfilPageBtn = document.getElementById('closeProfilPageBtn');
//----------------
//  LOGIN
//----------------
// sign up
signUpPageBtn.addEventListener('click', () => {
    signUpPage.style.display = 'flex';
});
closeSignUpPageBtn.addEventListener('click', () => {
    signUpPage.style.display = 'none';
});
signUpBtn.addEventListener('click', () => {
    const data = {
        login: loginUp.value,
        password: passwordUp.value
    };
    fetch('http://localhost:3000/sign/up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
        if (!data.success)
            console.log(data);
    })
        .catch(err => {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
    userLogin = loginUp.value;
    signUpPage.style.display = 'none';
    signUpPageBtn.style.display = 'none';
    signInPageBtn.style.display = 'none';
    enable2faPageBtn.style.display = 'flex';
});
// sign in
signInPageBtn.addEventListener('click', () => {
    signInPage.style.display = 'flex';
});
closeSignInPageBtn.addEventListener('click', () => {
    signInPage.style.display = 'none';
});
signInBtn.addEventListener('click', () => {
    const data = {
        login: loginIn.value,
        password: passwordIn.value
    };
    fetch('http://localhost:3000/sign/in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
        if (data.success) {
            userLogin = loginIn.value;
            signInPage.style.display = 'none';
            signInPageBtn.style.display = 'none';
            signUpPageBtn.style.display = 'none';
            if (data.method == 'sms')
                smsVerifyCode2faPage.style.display = 'flex';
            else if (data.method == 'email')
                emailVerifyCode2faPage.style.display = 'flex';
            else if (data.method == 'totp')
                totpVerifyCode2faPage.style.display = 'flex';
        }
        else {
            alert('Erreur : ' + data.message);
        }
    })
        .catch(err => {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
// enable 2fa
enable2faPageBtn.addEventListener('click', () => {
    all2faPage.style.display = 'flex';
});
close2faBtn.addEventListener('click', () => {
    all2faPage.style.display = 'none';
});
//----------------
//  SMS 2FA
//----------------
sms2faBtn.addEventListener('click', () => {
    all2faPage.style.display = 'none';
    sms2faPage.style.display = 'flex';
});
smsVerify2faBtn.addEventListener('click', () => {
    const data = {
        login: userLogin,
        phone: phone.value
    };
    fetch('http://localhost:3000/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
        if (data.success) {
            sms2faPage.style.display = 'none';
            smsVerifyCode2faPage.style.display = 'flex';
        }
        else {
            alert('Erreur : ' + data.message);
        }
    })
        .catch(err => {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
closeSms2faPageBtn.addEventListener('click', () => {
    sms2faPage.style.display = 'none';
    all2faPage.style.display = 'flex';
});
smsVerifyCode2faBtn.addEventListener('click', () => {
    const data2fa = {
        login: userLogin,
        phone: phone.value,
        code: smsCode2fa.value
    };
    fetch('http://localhost:3000/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data2fa)
    })
        .then(res => res.json())
        .then(data => {
        if (data.success) {
            smsVerifyCode2faPage.style.display = 'none';
            enable2faPageBtn.style.display = 'none';
        }
        else {
            alert('Code incorrect.');
        }
    })
        .catch(err => {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
//----------------
//  Email 2FA
//----------------
email2faBtn.addEventListener('click', () => {
    all2faPage.style.display = 'none';
    email2faPage.style.display = 'flex';
});
emailVerify2faBtn.addEventListener('click', () => {
    const data = {
        login: userLogin,
        email: email.value
    };
    fetch('http://localhost:3000/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
        if (data.success) {
            email2faPage.style.display = 'none';
            emailVerifyCode2faPage.style.display = 'flex';
        }
        else {
            alert('Erreur : ' + data.message);
        }
    })
        .catch(err => {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
closeEmail2faPageBtn.addEventListener('click', () => {
    email2faPage.style.display = 'none';
    all2faPage.style.display = 'flex';
});
emailVerifyCode2faBtn.addEventListener('click', () => {
    const data2fa = {
        login: userLogin,
        email: email.value,
        code: emailCode2fa.value
    };
    fetch('http://localhost:3000/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data2fa)
    })
        .then(res => res.json())
        .then(data => {
        if (data.success) {
            emailVerifyCode2faPage.style.display = 'none';
            enable2faPageBtn.style.display = 'none';
        }
        else {
            alert('Erreur : ' + data.message);
        }
    })
        .catch(err => {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
//----------------
//  TOTP 2FA
//----------------
totp2faBtn.addEventListener('click', () => {
    const data = {
        login: userLogin
    };
    fetch('http://localhost:3000/totp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
        if (data.success) {
            totp2faQrCode.src = data.qrCode;
            totp2faQrCode.style.display = 'block';
            all2faPage.style.display = 'none';
            totp2faPage.style.display = 'flex';
        }
        else {
            alert('Erreur : ' + data.message);
        }
    })
        .catch(err => {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
totpVerify2faBtn.addEventListener('click', () => {
    totp2faPage.style.display = 'none';
    totpVerifyCode2faPage.style.display = 'flex';
});
closeTotp2faPageBtn.addEventListener('click', () => {
    totp2faPage.style.display = 'none';
    all2faPage.style.display = 'flex';
});
totpVerifyCode2faBtn.addEventListener('click', () => {
    const data2fa = {
        login: userLogin,
        code: totpCode2fa.value
    };
    fetch('http://localhost:3000/totp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data2fa)
    })
        .then(res => res.json())
        .then(data => {
        if (data.success) {
            totpVerifyCode2faPage.style.display = 'none';
            enable2faPageBtn.style.display = 'none';
        }
        else {
            alert('Erreur : ' + data.message);
        }
    })
        .catch(err => {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
//----------------
//  OTHER
//----------------
profilBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/profil', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include"
    })
        .then(res => res.json())
        .then(data => {
        if (data.success) {
            profilPage.style.display = 'flex';
        }
        else {
            alert('Erreur : ' + data.message);
        }
    })
        .catch(err => {
        console.error("Erreur fetch :", err);
        alert('Une erreur est survenue');
    });
});
closeProfilPageBtn.addEventListener('click', () => {
    profilPage.style.display = 'none';
});
export {};
//# sourceMappingURL=sign.js.map