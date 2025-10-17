let userLogin = '';

//----------------
//  GET
//----------------

const profilBtn = document.getElementById('profilBtn') as HTMLInputElement;
const signUpPageBtn = document.getElementById('signUpPageBtn') as HTMLInputElement;
const signInPageBtn = document.getElementById('signInPageBtn') as HTMLInputElement;
const enable2faPageBtn = document.getElementById('enable2faPageBtn') as HTMLInputElement;

const signUpPage = document.getElementById('signUpPage') as HTMLInputElement;
const loginUp = document.getElementById('loginUp') as HTMLInputElement;
const passwordUp = document.getElementById('passwordUp') as HTMLInputElement;
const signUpBtn = document.getElementById('signUpBtn') as HTMLInputElement;
const closeSignUpPageBtn = document.getElementById('closeSignUpPageBtn') as HTMLInputElement;

const signInPage = document.getElementById('signInPage') as HTMLInputElement;
const loginIn = document.getElementById('loginIn') as HTMLInputElement;
const passwordIn = document.getElementById('passwordIn') as HTMLInputElement;
const signInBtn = document.getElementById('signInBtn') as HTMLInputElement;
const closeSignInPageBtn = document.getElementById('closeSignInPageBtn') as HTMLInputElement;

const all2faPage = document.getElementById('all2faPage') as HTMLInputElement;
const sms2faBtn = document.getElementById('sms2faBtn') as HTMLInputElement;
const email2faBtn = document.getElementById('email2faBtn') as HTMLInputElement;
const totp2faBtn = document.getElementById('totp2faBtn') as HTMLInputElement;
const close2faBtn = document.getElementById('close2faBtn') as HTMLInputElement;

const sms2faPage = document.getElementById('sms2faPage') as HTMLInputElement;
const phone = document.getElementById('phone') as HTMLInputElement;
const smsVerify2faBtn = document.getElementById('smsVerify2faBtn') as HTMLInputElement;
const closeSms2faPageBtn = document.getElementById('closeSms2faPageBtn') as HTMLInputElement;
const smsVerifyCode2faPage = document.getElementById('smsVerifyCode2faPage') as HTMLInputElement;
const smsCode2fa = document.getElementById('smsCode2fa') as HTMLInputElement;
const smsVerifyCode2faBtn = document.getElementById('smsVerifyCode2faBtn') as HTMLInputElement;

const email2faPage = document.getElementById('email2faPage') as HTMLInputElement;
const email = document.getElementById('email') as HTMLInputElement;
const emailVerify2faBtn = document.getElementById('emailVerify2faBtn') as HTMLInputElement;
const closeEmail2faPageBtn = document.getElementById('closeEmail2faPageBtn') as HTMLInputElement;
const emailVerifyCode2faPage = document.getElementById('emailVerifyCode2faPage') as HTMLInputElement;
const emailCode2fa = document.getElementById('emailCode2fa') as HTMLInputElement;
const emailVerifyCode2faBtn = document.getElementById('emailVerifyCode2faBtn') as HTMLInputElement;

const totp2faPage = document.getElementById('totp2faPage') as HTMLInputElement;
const totp2faQrCode = document.getElementById('totp2faQrCode') as HTMLInputElement;
const totpVerify2faBtn = document.getElementById('totpVerify2faBtn') as HTMLInputElement;
const closeTotp2faPageBtn = document.getElementById('closeTotp2faPageBtn') as HTMLInputElement;
const totpVerifyCode2faPage = document.getElementById('totpVerifyCode2faPage') as HTMLInputElement;
const totpCode2fa = document.getElementById('totpCode2fa') as HTMLInputElement;
const totpVerifyCode2faBtn = document.getElementById('totpVerifyCode2faBtn') as HTMLInputElement;

const profilPage = document.getElementById('profilPage') as HTMLInputElement;
const closeProfilPageBtn = document.getElementById('closeProfilPageBtn') as HTMLInputElement;


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
        } else {
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
        } else {
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
            localStorage.setItem("jwt", data.token);
        } else {
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
        } else {
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
            localStorage.setItem("jwt", data.token);
        } else {
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
        } else {
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
            localStorage.setItem("jwt", data.token);
        } else {
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
        } else {
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
