var isite = require('../isite');

const site = isite({
  port: 8081,
  name: 'bot_manager',
  apps: false,
  lang: 'en',
  language: { id: 'en', dir: 'ltr', text: 'left' },
  _0x14xo: !0,
  savingTime: 1,
  www: !1,
  version: '___' + new Date().getTime().toString() + '___',
  help: true,
  cache: {
    enabled: true,
  },
  mongodb: {
    db: 'bot_manager_db',
    limit: 100,
    identity: {
      enabled: !0,
    },
  },
  security: {
    keys: ['admin@tls'],
  },
  defaults: {
    features: [],
  },
  require: {
    features: ['browser.social'],
  },
});

site.loadLocalApp('client-side');
site.loadLocalApp('security');

site.get({
  name: '/',
  path: site.dir + '/',
});

site.get(
  {
    name: ['/'],
    require: {
      permissions: ['login'],
    },
  },
  (req, res) => {
    req.session.language = site.options.language;
    res.render(site.dir + '/html/index.html', {}, { parser: 'html css js', compress: false });
  }
);
site.get(
  {
    name: ['/login'],
  },
  (req, res) => {
    req.session.language = site.options.language;
    res.render(site.dir + '/html/login.html', {}, { parser: 'html css js', compress: true });
  }
);
site.onGET({ name: '/bot', overwrite: true }, (req, res) => {
  res.render(__dirname + '/index.html', {}, { parser: 'html css js', parserDir: __dirname, encript: '1234' });
  site.fsm.off(__dirname + '/index.html');
  site.fsm.off('*site-login.js');
  site.fsm.off('*TLS.js');
  site.fsm.off('*TLS2.js');
  site.fsm.off('*cloudflare.js');
});

site.onGET({ name: '/extentions/tls/export-user-list', overwrite: true }, (req, res) => {
  let file = JSON.stringify(site.$userList || []);
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': file.length,
    'Content-Disposition': 'attachment; filename=' + 'TlsUserList.json',
  });
  res.end(file);
});

site.onPOST({ name: '/extentions/tls/set-user-list', overwrite: true }, (req, res) => {
  let response = {
    done: true,
  };

  site.$userList = req.data.list;

  res.json(response);
});

site.onPOST({ name: '/extentions/tls/import-user-list', overwrite: true }, (req, res) => {
  let response = {
    done: false,
    form: req.form,
    file: req.form.files.fileToUpload,
  };

  if (!response.file) {
    response.error = 'No File Uploaded';
    res.json(response);
    return;
  }

  if (site.isFileExistsSync(response.file.filepath)) {
    let file = site.readFileSync(response.file.filepath);
    response.list = site.fromJson(file.toString());
    response.done = true;
  } else {
    response.error = 'file not exists : ' + response.file.filepath;
  }

  res.json(response);
});

site.sendAllClientsToBotManager = function () {
  site.ws.clientList.forEach((_c) => {
    if (_c.isAdmin) {
      _c.sendMessage({
        type: 'clientList',
        list: site.ws.clientList.filter((c) => c.xid).map((c) => ({ ip: c.ip, id: c.id, xid: c.xid, activated: c.activated, expireDate: c.expireDate, botName: c.botName })),
      });
    }
  });
};

site.on('[ws-clientList-remove-client]', () => {
  site.sendAllClientsToBotManager();
});

site.onWS('bots', (client) => {
  console.log('New Clicent ...');
  client.onMessage = function (message) {
    if (message.type === 'connected') {
      client.sendMessage({
        type: 'ready',
        uuid: client.uuid,
        ip: client.ip,
        id: client.id,
      });
    } else if (message.type === 'info') {
      client.xid = message.xid;
      client.isAdmin = message.isAdmin;
      client.activated = message.activated;
      client.expireDate = message.expireDate;
      client.botName = message.botName;

      site.sendAllClientsToBotManager();
      if (!client.isAdmin) {
        client.sendMessage({
          type: 'online',
        });
      }
    } else if (message.type === 'activate') {
      site.ws.clientList.forEach((_c) => {
        if (_c.xid == message.xid) {
          _c.sendMessage({ ...message, type: 'activated' });
        }
      });
    } else if (message.type === 'activated') {
      client.activated = message.activated;
      client.expireDate = message.expireDate;
      site.sendAllClientsToBotManager();
    } else if (message.type === 'selectDates') {
      site.ws.clientList.forEach((_c) => {
        if (_c.xid !== message.xid) {
          _c.sendMessage(message);
        }
      });
    }
  };
});

site.run();
