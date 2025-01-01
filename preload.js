if (document.location.href.like('*tlscontact.com*|*extentions/TLS*')) {
  SOCIALBROWSER.var.blocking.open_list = [];
  window.eval = function (code) {
    try {
      return window.eval0(code);
    } catch (error) {
      return undefined;
    }
  };
  SOCIALBROWSER.on('share', (e, data) => {
    if (data.type == '[local-date-exists]') {
      SOCIALBROWSER.stopRequest = false;
      if (SOCIALBROWSER.user && SOCIALBROWSER.user.centre && SOCIALBROWSER.user.email !== data.user.email && SOCIALBROWSER.user.centre.name == data.user.centre.name) {
        if ((btn = document.querySelector('#selectTLSButton'))) {
          SOCIALBROWSER.click(btn);
        }
      }
    }
    if (data.type == '[click-appontment]') {
      if (!SOCIALBROWSER.getDatesRuning) {
        SOCIALBROWSER.stopRequest = false;
        if (SOCIALBROWSER.user && SOCIALBROWSER.user.centre && SOCIALBROWSER.user.centre.name == data.user.centre.name) {
          if ((btn = document.querySelector('#selectTLSButton'))) {
            SOCIALBROWSER.click(btn);
          }
        }
      }
    } else if (data == '[TLS]') {
      SOCIALBROWSER.stopRequest = false;
      if ((btn = document.querySelector('#selectTLSButton'))) {
        SOCIALBROWSER.click(btn);
      } else {
        SOCIALBROWSER.getdates();
      }
    } else if (data.type == '[goto-bottom]' && data.partition == SOCIALBROWSER.partition) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }
  });

  SOCIALBROWSER.__showBotImage();

  function clickCapatcha() {
    document.querySelectorAll('*').forEach((element) => {
      if (element.shadowRoot) {
        console.log(element);
      }
    });
  }
}

SOCIALBROWSER.addMenu({
  label: '*** Open TLS Contact Manager ***',
  click() {
    document.location.href = 'http://127.0.0.1:60080/extentions/TLS';
  },
});

SOCIALBROWSER.addMenu({
  label: '*** video***',
  click() {
    document.location.href = 'http://127.0.0.1:60080/extentions/video';
  },
});

SOCIALBROWSER.addMenu({
  type: 'separator',
});

SOCIALBROWSER.onLoad(() => {});
