(function () {
  'use strict';

  if (document.location.href == 'https://visas-fr.tlscontact.com/') {
    document.location.href = SOCIALBROWSER.user.link;
  }

  SOCIALBROWSER.shuffleArray = function (array) {
    let index = -1;
    const length = array.length;
    const lastIndex = length - 1;
    while (++index < length) {
      const rand = SOCIALBROWSER.randomNumber(index, lastIndex);
      [array[index], array[rand]] = [array[rand], array[index]];
    }
    return array;
  };

  SOCIALBROWSER.unlock = function () {
    SOCIALBROWSER.ipc('[open new popup]', {
      partition: 'ghost_' + new Date().getTime(),
      url: SOCIALBROWSER.user.link,
      eval: SOCIALBROWSER.customSetting.eval,
      proxy: SOCIALBROWSER.user.proxy,
      iframe: true,
      allowDevTools: false,
      alwaysOnTop: false,
      skipTaskbar: false,
      vip: true,
      show: true,
      center: true,
    });
    SOCIALBROWSER.currentWindow.close();
  };

  SOCIALBROWSER.keepLogin = function () {
    let apiGETUrl = 'https://' + SOCIALBROWSER.user.centre.prefix + SOCIALBROWSER.user.centre.country + '.tlscontact.com/api/account';
    fetch(apiGETUrl)
      .then((response) => response)
      .then((data) => {
        if (data.status == 200) {
          console.log('Keep Login Done ...');
        }
      });
  };

  setInterval(() => {
    if (!SOCIALBROWSER.isIframe() && !SOCIALBROWSER.stopRequest) {
      SOCIALBROWSER.keepLogin();
    }
  }, 1000 * SOCIALBROWSER.user.timeLogin);

  SOCIALBROWSER.drawAdminForm = function () {
    let new_div = document.createElement('div');
    new_div.id = 'HIMA';
    new_div.innerHTML = SOCIALBROWSER.from123(SOCIALBROWSER.addHTML);
    let ele = document.querySelector('.tls-appointment header');
    if (ele) {
      ele.append(new_div);
      setTimeout(() => {
        if (document.location.href === SOCIALBROWSER.user.link) {
          if (SOCIALBROWSER.user.timeRefresh && !SOCIALBROWSER.stopRequest) {
            SOCIALBROWSER.user.refreshTimeout = setTimeout(() => {
              if (!SOCIALBROWSER.stopRequest) {
                document.location.reload();
              }
            }, SOCIALBROWSER.user.timeRefresh * 1000);
          }

          SOCIALBROWSER.stopRequest = false;
          if (SOCIALBROWSER.user.autoAppointment) {
            if (!SOCIALBROWSER.stopRequest) {
              SOCIALBROWSER.getdates();
            }
          }
        }

        let ele1 = document.querySelector('#refreshTLSTime');
        if (ele1) {
          ele1.addEventListener('input', () => {
            SOCIALBROWSER.user.timeRequest = parseInt(ele1.value);
            SOCIALBROWSER.user.timeRequestS = SOCIALBROWSER.user.timeRequest * 1000;
          });
        }
        let ele2 = document.querySelector('#parallelConnections');
        if (ele2) {
          ele2.addEventListener('input', () => {
            SOCIALBROWSER.bookCount = parseInt(ele2.value);
          });
        }
        let ele3 = document.querySelector('#refreshPageInput');
        if (ele3) {
          ele3.addEventListener('input', () => {
            SOCIALBROWSER.user.timeRefresh = parseInt(ele3.value);
            clearTimeout(SOCIALBROWSER.user.refreshTimeout);
            if (SOCIALBROWSER.user.timeRefresh && document.location.href === SOCIALBROWSER.user.link) {
              SOCIALBROWSER.user.refreshTimeout = setTimeout(() => {
                document.location.reload();
              }, SOCIALBROWSER.user.timeRefresh * 1000);
            }
          });
        }
      }, 1000 * 1);
    } else {
      setTimeout(() => {
        SOCIALBROWSER.drawAdminForm();
      }, 1000);
    }
  };
  SOCIALBROWSER.onLoad(() => {
    SOCIALBROWSER.drawAdminForm();
  });

  var client = SOCIALBROWSER.user.email;
  var url_table = SOCIALBROWSER.user.link;
  var day_to_skip = []; ///1;2;3.......
  var typeVisa = SOCIALBROWSER.user.visaType.name || 'Grand Public PRIMO';

  var userMessage = 'Start';
  var ribbon = document.querySelector('#ribbon');
  function updateRibbonText() {
    if ((ribbon = document.querySelector('#ribbon'))) {
      ribbon.textContent = 'Client: ' + SOCIALBROWSER.user.name + ' ➤ ' + userMessage + ' ➤ ' + new Date().toLocaleString();
    }
  }
  function updateRibbonColor(color) {
    if ((ribbon = document.querySelector('#ribbon'))) {
      ribbon.style.backgroundColor = color;
    }
  }
  SOCIALBROWSER.user.timeRequestS = SOCIALBROWSER.user.timeRequest * 1000;

  function speakHello() {
    const message = new SpeechSynthesisUtterance('HIMA TLS HIMA TLS HIMA TLS' + client);
    message.rate = 1.0;
    window.speechSynthesis.speak(message);
  }
  function repeatSpeech() {
    speakHello();
    // setInterval(speakHello, 10000);
  }

  (function () {
    'use strict';

    function createRibbon() {
      ribbon.style.backgroundColor = '#0a308f';
      ribbon.style.color = 'white';
      ribbon.style.textAlign = 'center';
      ribbon.style.padding = '10px';
      ribbon.style.position = 'fixed';
      ribbon.style.top = '0';
      ribbon.style.width = '100%';
      ribbon.style.zIndex = '9999';
      ribbon.style.width = '100%'; // Définir la largeur à 100%
      ribbon.style.height = '10px'; // Définir la hauteur à 50 pixels
      ribbon.style.cursor = 'pointer';
      ribbon.style.boxShadow = '0 3px 36px -25px rgba(0,0,0,.75)';
      ribbon.style.display = 'flex';
      ribbon.style.alignItems = 'center'; // Centrer verticalement
      ribbon.style.justifyContent = 'center'; // Centrer horizontalement
      ribbon.style.fontWeight = 'bold';
      /////////////////////////////////////////////////
      document.body.appendChild(ribbon);
      /////////////////////////////////////////////////
      ribbon.addEventListener('click', function () {
        SOCIALBROWSER.getdates(url);
      });
      /////////////////////////////////////////////////
    }
    // createRibbon();
    // updateRibbonText();
  })();

  var k;
  var url;
  var sp = url_table.split('/');
  var country = sp[4];
  var region = sp[5];
  var id = sp[6];
  var captcha;
  var c_token;

  url =
    'https://fr.tlscontact.com/services/customerservice/api/tls/appointment/' +
    country +
    '/' +
    region +
    '/table?client=fr&issuer=' +
    region +
    '&formGroupId=' +
    id +
    '&appointmentType=' +
    typeVisa +
    '&appointmentStage=appointment';

  //getdates(url);
  var tries = 0;

  var values;
  var dates = [];
  var cookiz = document.cookie.split(';');
  for (var z = 0; z < cookiz.length; z++) {
    if (cookiz[z].includes('XSRF')) {
      c_token = cookiz[z].split('=')[1];
      break;
      console.log(c_token);
    }
  }

  function getdates(theUrl) {
    if (SOCIALBROWSER.stopRequest || SOCIALBROWSER.dates || SOCIALBROWSER.bookDone) {
      return false;
    }
    SOCIALBROWSER.getDatesRuning = true;
    tries = tries + 1;
    userMessage = tries;
    updateRibbonText();
    updateRibbonColor('#0a308f');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', theUrl, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var st = xhr.status;

        if (st == 200) {
          display('Good');

          k = xhr.responseText;
          findDateAndBook(xhr.responseText);
        } else if (st == 403) {
          display('Forbidden 403');
          // window.chrome.webview.postMessage(url + '@cloudflare');
          setTimeout(function () {
            getdates(url);
          }, SOCIALBROWSER.user.timeRequestS);
        } else if (st == 401) {
          var loginurl = 'https://fr.tlscontact.com/oauth2/authorization/oidc';
          var user = SOCIALBROWSER.user.email;
          var password = SOCIALBROWSER.user.password;
          // window.chrome.webview.postMessage(loginurl + '@' + user + '@' + password + '@reconnectnow');
          display('CLICK UNLOCK');
          setTimeout(function () {
            getdates(url);
          }, SOCIALBROWSER.user.timeRequestS);
        } else if (st == 429) {
          display('Too Many Requests 429');
          SOCIALBROWSER.stopRequest = true;
          //  setTimeout(function () {
          //   getdates(url);
          // }, SOCIALBROWSER.user.timeRequestS);
        } else if (st == 404) {
          display('Not Found 404');
          SOCIALBROWSER.stopRequest = true;
          //  setTimeout(function () {
          //   getdates(url);
          // }, SOCIALBROWSER.user.timeRequestS);
        } else if (st == 500) {
          display('Internal Server Error');
          // window.chrome.webview.postMessage(loginurl + '@' + user + '@' + password + '@reconnectnow');
          setTimeout(function () {
            getdates(url);
          }, SOCIALBROWSER.user.timeRequestS);
        } else {
          display('Server Error ');
          //  setTimeout(function () {
          //   getdates(url);
          // }, SOCIALBROWSER.user.timeRequestS);
        }
      }
    };
    xhr.send();
  }

  SOCIALBROWSER.getdates = function () {
    getdates(url);
  };

  function display(text) {
    tries = tries + 1;
    userMessage = tries + ' ' + text;
    updateRibbonText();
  }

  function findDateAndBook(t) {
    dates.length = 0;
    try {
      values = JSON.parse(t);
    } catch (error) {
      console.log(error);
      return;
    }

    var count = Object.keys(values).length;
    for (var i = 0; i < count; i++) {
      var key = Object.keys(values)[i];
      var row = values[key];
      var row_count = Object.keys(row).length;

      for (var j = 0; j < row_count; j++) {
        var row_key = Object.keys(row)[j];
        var availabality = Object.values(row)[j];
        if (availabality > 0 && !day_to_skip.includes(key)) dates[dates.length] = key + ' ' + row_key;
        //console.log(key+" " +row_key+" "+availabality);
      }
    } //end loops
    if (dates.length > 0) {
      SOCIALBROWSER.share({ type: '[local-date-exists]', user: SOCIALBROWSER.user, partition: SOCIALBROWSER.partition });
      SOCIALBROWSER.share({ type: '[date-exists]', user: SOCIALBROWSER.user, partition: SOCIALBROWSER.partition });

      dates = SOCIALBROWSER.shuffleArray(dates);
      SOCIALBROWSER.dates = dates;

      let msgT = 'Hima New Dates on : ' + SOCIALBROWSER.user.centre.country + ' , region : ' + SOCIALBROWSER.user.centre.name + ' \n ' + JSON.stringify(dates) + '\n By Hima';
      SOCIALBROWSER.addZero = function (code, number) {
        let c = number - code.toString().length;
        for (let i = 0; i < c; i++) {
          code = '0' + code.toString();
        }
        return code;
      };
      SOCIALBROWSER.connectTelegramBot({ token: '8033142036:AAG_VF0v2IPv8qZa8RrGjFW7u0NREtZbdeQ' }).sendMessage('-1002371406667', msgT);

      if (SOCIALBROWSER.user.autoBook) {
        if (!SOCIALBROWSER.bookDone) {
          let d = null;
          if (SOCIALBROWSER.user.bookTime) {
            let date0 = new Date(SOCIALBROWSER.user.bookTime);
            d = date0.getFullYear() + '-' + (date0.getMonth() + 1) + '-' + date0.getDate() + ' ' + SOCIALBROWSER.addZero(date0.getHours(), 2) + ':' + SOCIALBROWSER.addZero(date0.getMinutes(), 2);
            SOCIALBROWSER.user.bookTime = null;
          }
          d = d || dates.pop();
          getCaptcha(d);
          notify('Date found: ' + d);
          updateRibbonColor('#fc6f03');
        } else {
          clearInterval(SOCIALBROWSER.bookInterval);
        }
        SOCIALBROWSER.bookInterval = setInterval(() => {
          if (!SOCIALBROWSER.bookDone) {
            let d = dates.pop();
            getCaptcha(d);
            notify('Date found: ' + d);
            updateRibbonColor('#fc6f03');
          } else {
            clearInterval(SOCIALBROWSER.bookInterval);
          }
        }, 1000 * 5);
      }
    } else {
      setTimeout(function () {
        getdates(url);
      }, SOCIALBROWSER.user.timeRequestS);
    }
  }

  function getCaptcha(take) {
    if (SOCIALBROWSER.stopRequest || SOCIALBROWSER.bookDone) {
      return false;
    }
    notify('OK OK OK');
    console.log('happend');
    grecaptcha.ready(function () {
      grecaptcha.execute('6LcTpXcfAAAAAM3VojNhyV-F1z92ADJIvcSZ39Y9', { action: 'book' }).then(function (token) {
        console.log(token);
        captcha = token;
        catchit(take);
      });
    });
  } //end captcha

  function catchit(take) {
    if (SOCIALBROWSER.stopRequest || SOCIALBROWSER.bookDone == true) {
      return false;
    }
    notify('Pending');
    var c_url =
      'https://fr.tlscontact.com/services/customerservice/api/tls/appointment/book?client=fr&issuer=' +
      region +
      '&formGroupId=' +
      id +
      '&timeslot=' +
      take +
      '&appointmentType=' +
      typeVisa +
      '&accountType=INDI&lang=fr-fr';

    var xhr = new XMLHttpRequest();
    xhr.open('POST', c_url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.setRequestHeader('recaptcha-token', captcha);
    xhr.setRequestHeader('X-XSRF-TOKEN', c_token);
    // xhr.setRequestHeader('Cookie', document.cookie);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Success
          SOCIALBROWSER.bookDone = true;
          var msg = JSON.parse(xhr.responseText);
          if (msg.error == 'book_appointment_fail') {
            getdates(url);
          } else if (msg.status == 'success') {
            updateRibbonColor('#08fc45');
            repeatSpeech();
            window.location.href = SOCIALBROWSER.user.link.replace('appointment', 'personal');
          } else {
            console.log('Error Error Error!');
            getdates(url);
            updateRibbonColor('#0a308f');
          }
        } else {
          // Error
          if (xhr.status === 400) {
            SOCIALBROWSER.stopRequest = true;
            notify('Bad Request : 400');
            updateRibbonColor('#ff0505');
          } else if (xhr.status === 429) {
            SOCIALBROWSER.stopRequest = true;
            notify('Too Many Requests : 429');
            updateRibbonColor('#ff0505');
          } else {
            notify('Error Error Error! : ' + xhr.status);
            updateRibbonColor('#ff0505');
          }
          console.log(xhr.responseText);
        }
      }
    };

    xhr.send();
  }

  function getType() {
    var response;
    var title = document.getElementsByClassName('tls-heading-1')[0];

    userMessage = 'Préparation..';
    updateRibbonText();
    var u = 'https://fr.tlscontact.com/services/customerservice/api/tls/appointment/appointment_type/fr/' + id;

    var visatypeindex;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', u, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Request succeeded
          response = JSON.parse(xhr.responseText);
          typeVisa = response.appointment_type;
          if (visatypeindex == 1) {
            typeVisa = 'prime time';
          } else if (visatypeindex == 2) {
            typeVisa = 'prime time weekend';
          }
          notify('Type de visa détécté');
          url =
            'https://fr.tlscontact.com/services/customerservice/api/tls/appointment/' +
            country +
            '/' +
            region +
            '/table?client=fr&issuer=' +
            region +
            '&formGroupId=' +
            id +
            '&appointmentType=' +
            typeVisa +
            '&appointmentStage=appointment';

          setTimeout(function () {
            getdates(url);
          }, SOCIALBROWSER.user.timeRequestS);
        } else {
          alert('Error Try again');
        }
      }
    };
    xhr.send();
  }

  function notify(txt) {
    userMessage = txt;
    updateRibbonText();
  }
})();
