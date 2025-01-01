if (SOCIALBROWSER.user0) {
  SOCIALBROWSER.user = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.user0));
}
SOCIALBROWSER.allowBot = false;

if (SOCIALBROWSER.user.activated) {
  SOCIALBROWSER.allowBot = true;
}

SOCIALBROWSER.user.timeRequest = parseInt(SOCIALBROWSER.user.timeRequest) || 60 * 60; ///en seconde
SOCIALBROWSER.user.timeRefresh = parseInt(SOCIALBROWSER.user.timeRefresh) || 60 * 60; ///en seconde
SOCIALBROWSER.user.timeLogin = parseInt(SOCIALBROWSER.user.timeLogin) || 60 * 60; ///en seconde

SOCIALBROWSER.onLoad(() => {
  setInterval(() => {
    document.title = 'Client : ' + SOCIALBROWSER.user.name + '  , Email : ' + SOCIALBROWSER.user.email;
  }, 1000 * 1);

  setInterval(() => {
    let ele = document.querySelector('#tls-news-banner');
    if (ele) {
      ele.remove();
    }
  }, 1000 * 5);

  if (!SOCIALBROWSER.allowBot) {
    alert('Wrong Activated Key', 1000 * 60);
    setTimeout(() => {
      window.close();
    }, 1000 * 3);
    return false;
  }

  let loginButtonClicked = false;
  function testLogin() {
    if (loginButtonClicked) {
      alert('Waiting Login Process ...');
      return;
    }

    if (SOCIALBROWSER.user) {
      let usernameInput = document.querySelector('input[type=text]');
      let passwordInput = document.querySelector('input[type=password]');

      if (usernameInput && passwordInput) {
        loginButtonClicked = true;
        SOCIALBROWSER.write(SOCIALBROWSER.user.email, usernameInput).then(() => {
          SOCIALBROWSER.write(SOCIALBROWSER.user.password, passwordInput).then(() => {
            SOCIALBROWSER.click('#kc-login');
            setInterval(() => {
              SOCIALBROWSER.click('#kc-login');
            }, 1000 * 5);
          });
        });
      }
    } else {
      alert('No User Login Information');
    }
    setTimeout(() => {
      testLogin();
    }, 1000 * 10);
  }
  function closePopup() {
    if ((popup = document.querySelector('.tls-button-icon'))) {
      if (document.location.href.like('https://fr.tlscontact.com/appointment/*')) {
        SOCIALBROWSER.click(popup);
      }
    }
    setTimeout(() => {
      closePopup();
    }, 1000);
  }
  testLogin();
  closePopup();
});
