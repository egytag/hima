if (!SOCIALBROWSER.isIframe()) {
    if (document.location.href == 'https://visas-fr.tlscontact.com/') {
        document.location.href = SOCIALBROWSER.user.link;
    }

    SOCIALBROWSER.menu_list = [];
    SOCIALBROWSER.var.blocking.open_list = [];
    SOCIALBROWSER.var.blocking.context_menu.page_options = false;
    SOCIALBROWSER.var.core.emails = { enabled: false };

    SOCIALBROWSER.visaType = sessionStorage.getItem('VISA_TYPE') || SOCIALBROWSER.user.visaType.name || 'normal';
    sessionStorage.setItem('VISA_TYPE', SOCIALBROWSER.visaType);

    SOCIALBROWSER.on('share', (e, data) => {
        if (data.type == '[local-date-exists]') {
            SOCIALBROWSER.stopRequest = false;
            if (SOCIALBROWSER.user && SOCIALBROWSER.user.centre && SOCIALBROWSER.user.email !== data.user.email && SOCIALBROWSER.user.centre.name == data.user.centre.name) {
                let btn = document.querySelector('#selectTLSButton');
                if (btn) {
                    SOCIALBROWSER.click(btn);
                }
            }
        }
        if (data.type == '[click-appontment]') {
            if (!SOCIALBROWSER.getDatesRuning) {
                SOCIALBROWSER.stopRequest = false;
                if (SOCIALBROWSER.user && SOCIALBROWSER.user.centre && SOCIALBROWSER.user.centre.name == data.user.centre.name) {
                    let btn = document.querySelector('#selectTLSButton');
                    if (btn) {
                        SOCIALBROWSER.click(btn);
                    }
                }
            }
        } else if (data == '[TLS]') {
            SOCIALBROWSER.stopRequest = false;
            SOCIALBROWSER.getdates();
        } else if (data.type == '[goto-bottom]' && data.partition == SOCIALBROWSER.partition) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
            });
        }
    });

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
        let defaultUserAgent = SOCIALBROWSER.getRandomBrowser('pc', 'chrome');
        SOCIALBROWSER.ipc('[open new popup]', {
            partition: 'ghost_' + new Date().getTime() + '_' + SOCIALBROWSER.randomNumber(),
            show: true,
            defaultUserAgent: defaultUserAgent,
            url: SOCIALBROWSER.user.link,
            eval: SOCIALBROWSER.customSetting.eval,
            proxy: SOCIALBROWSER.user.proxy,
            iframe: true,
            cloudFlare: true,
            allowAds: true,
            allowPopup: true,
            showDevTools: false,
            alwaysOnTop: false,
            skipTaskbar: false,
            vip: true,
            center: true,
        });
        SOCIALBROWSER.window.close();
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
            let h1 = document.querySelector('h1');
            if (h1) {
                h1.remove();
            }
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

                let ele4 = document.getElementById('VISATYPESELECT');
                if (ele4) {
                    ele4.value = SOCIALBROWSER.visaType;
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

    SOCIALBROWSER.changeVisaType = function () {
        SOCIALBROWSER.visaType = document.getElementById('VISATYPESELECT').value;
        sessionStorage.setItem('VISA_TYPE', SOCIALBROWSER.visaType);
    };

    var userMessage = 'Start';
    var ribbon = document.querySelector('#ribbon');
    function updateRibbonText() {
        let ribbon = document.querySelector('#ribbon');
        if (ribbon) {
            ribbon.textContent = 'Client: ' + SOCIALBROWSER.user.name + ' ➤ ' + userMessage + ' ➤ ' + new Date().toLocaleString();
        }
    }
    function updateRibbonColor(color) {
        let ribbon = document.querySelector('#ribbon');
        if (ribbon) {
            ribbon.style.backgroundColor = color;
        }
    }
    SOCIALBROWSER.user.timeRequestS = SOCIALBROWSER.user.timeRequest * 1000;

    function speakHello() {
        const message = new SpeechSynthesisUtterance('DZ GROBLER ' + client);
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
                SOCIALBROWSER.getdates();
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
        SOCIALBROWSER.visaType +
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

    function getdates(theUrl = null) {
        theUrl =
            theUrl ||
            'https://fr.tlscontact.com/services/customerservice/api/tls/appointment/' +
                country +
                '/' +
                region +
                '/table?client=fr' +
                '&formGroupId=' +
                id +
                '&appointmentType=' +
                SOCIALBROWSER.visaType +
                '&appointmentStage=appointment';

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
                        getdates();
                    }, SOCIALBROWSER.user.timeRequestS);
                } else if (st == 401) {
                    var loginurl = 'https://fr.tlscontact.com/oauth2/authorization/oidc';
                    var user = SOCIALBROWSER.user.email;
                    var password = SOCIALBROWSER.user.password;
                    // window.chrome.webview.postMessage(loginurl + '@' + user + '@' + password + '@reconnectnow');
                    display('Appuyez Sur Debloquer');
                    setTimeout(function () {
                        getdates();
                    }, SOCIALBROWSER.user.timeRequestS);
                } else if (st == 429) {
                    display('Too Many Requests 429');
                    SOCIALBROWSER.stopRequest = true;
                    //  setTimeout(function () {
                    //   getdates(url);
                    // }, SOCIALBROWSER.user.timeRequestS);
                } else if (st == 404) {
                    display('NO RDV');
                    setTimeout(function () {
                        getdates();
                    }, SOCIALBROWSER.user.timeRequestS);
                    // SOCIALBROWSER.stopRequest = true;
                    //  setTimeout(function () {
                    //   getdates(url);
                    // }, SOCIALBROWSER.user.timeRequestS);
                } else if (st == 500) {
                    display('Internal Server Error');
                    // window.chrome.webview.postMessage(loginurl + '@' + user + '@' + password + '@reconnectnow');
                    setTimeout(function () {
                        getdates();
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
        getdates();
    };
    SOCIALBROWSER.addZero = function (code, number) {
        let c = number - code.toString().length;
        for (let i = 0; i < c; i++) {
            code = '0' + code.toString();
        }
        return code;
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

            let messageDates = '';
            dates.forEach((d) => {
                messageDates += d + '\n';
            });

            let msgT = 'Hima New Dates on : ' + SOCIALBROWSER.user.centre.country + ' , region : ' + SOCIALBROWSER.user.centre.name + ' \n ' + messageDates + '\n By Hima';

            if (SOCIALBROWSER.user.bookType) {
                if (SOCIALBROWSER.user.bookType.id == 1) {
                    dates = SOCIALBROWSER.shuffleArray(dates);
                } else if (SOCIALBROWSER.user.bookType.id == 2) {
                    if (dates.length > 1) {
                        dates = dates.slice(0, parseInt(dates.length / 2));
                    }
                } else if (SOCIALBROWSER.user.bookType.id == 3) {
                    if (dates.length > 2) {
                        dates = dates.slice(parseInt(dates.length / 3), parseInt((dates.length / 3) * 2));
                    }
                } else if (SOCIALBROWSER.user.bookType.id == 4) {
                    if (dates.length > 1) {
                        dates = dates.slice(parseInt(dates.length / 2));
                    }
                }
            }

            dates = SOCIALBROWSER.shuffleArray(dates);

            SOCIALBROWSER.dates = dates;
            SOCIALBROWSER.selectedDate = null;
            if (true) {
                SOCIALBROWSER.connectTelegramBot({ token: '8033142036:AAG_VF0v2IPv8qZa8RrGjFW7u0NREtZbdeQ' }).sendMessage('-1002371406667', msgT);
            }

            if (SOCIALBROWSER.user.autoBook) {
                if (!SOCIALBROWSER.bookDone) {
                    if (SOCIALBROWSER.user.bookDate) {
                        let date0 = new Date(SOCIALBROWSER.user.bookDate);
                        SOCIALBROWSER.selectedDate =
                            date0.getFullYear() +
                            '-' +
                            (date0.getMonth() + 1) +
                            '-' +
                            date0.getDate() +
                            ' ' +
                            SOCIALBROWSER.addZero(date0.getHours(), 2) +
                            ':' +
                            SOCIALBROWSER.addZero(date0.getMinutes(), 2);
                        SOCIALBROWSER.user.bookDate = null;
                    } else if (SOCIALBROWSER.user.bookTimeList) {
                        SOCIALBROWSER.dates = [];
                        SOCIALBROWSER.user.bookTimeList
                            .filter((bt) => bt.$selected == true)
                            .forEach((bt) => {
                                dates
                                    .filter((dd) => dd.contains(bt.time))
                                    .forEach((ddd) => {
                                        SOCIALBROWSER.dates.push(ddd);
                                    });
                            });
                        if (SOCIALBROWSER.dates.length == 0) {
                            SOCIALBROWSER.dates = dates;
                        }
                    }
                    if (SOCIALBROWSER.dates.length > 0) {
                        SOCIALBROWSER.selectedDate = SOCIALBROWSER.selectedDate || SOCIALBROWSER.dates.pop();
                        getCaptcha(SOCIALBROWSER.selectedDate);
                        notify('Date Trouvée: ' + SOCIALBROWSER.selectedDate);
                        updateRibbonColor('#fc6f03');
                    }
                } else {
                    clearInterval(SOCIALBROWSER.bookInterval);
                }
                SOCIALBROWSER.bookInterval = setInterval(() => {
                    if (!SOCIALBROWSER.bookDone && SOCIALBROWSER.dates.length > 0) {
                        SOCIALBROWSER.selectedDate = SOCIALBROWSER.dates.pop();
                        getCaptcha(SOCIALBROWSER.selectedDate);
                        notify('Date found: ' + SOCIALBROWSER.selectedDate);
                        updateRibbonColor('#fc6f03');
                    } else {
                        clearInterval(SOCIALBROWSER.bookInterval);
                    }
                }, 1000 * 5);
            }
        } else {
            setTimeout(function () {
                getdates();
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
        notify('Attendre la Réponse Du Serveur TLS');

        var c_url =
            'https://fr.tlscontact.com/services/customerservice/api/tls/appointment/book?client=fr&issuer=' +
            region +
            '&formGroupId=' +
            id +
            '&timeslot=' +
            take +
            '&appointmentType=' +
            SOCIALBROWSER.visaType +
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
                        getdates();
                    } else if (msg.status == 'success') {
                        updateRibbonColor('#08fc45');
                        repeatSpeech();
                        window.location.href = SOCIALBROWSER.user.link.replace('appointment', 'personal');
                    } else {
                        console.log('Erreur De Serveur TLS');
                        getdates();
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
                        notify('Erreur De Serveur TLS : ' + xhr.status);
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
                    SOCIALBROWSER.visaType = response.appointment_type;
                    if (visatypeindex == 1) {
                        SOCIALBROWSER.visaType = 'prime time';
                    } else if (visatypeindex == 2) {
                        SOCIALBROWSER.visaType = 'prime time weekend';
                    }
                    notify('Type de visa détécté');
                    url =
                        'https://fr.tlscontact.com/services/customerservice/api/tls/appointment/' +
                        country +
                        '/' +
                        region +
                        '/table?client=fr' +
                        '&formGroupId=' +
                        id +
                        '&appointmentType=' +
                        SOCIALBROWSER.visaType +
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

    window.share = SOCIALBROWSER.share;
    window.stopRequest = function (value) {
        SOCIALBROWSER.stopRequest = value;
    };
    window.getdates = SOCIALBROWSER.getdates;
    window.unlock = SOCIALBROWSER.unlock;
    window.changeVisaType = SOCIALBROWSER.changeVisaType;
}
