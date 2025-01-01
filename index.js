module.exports = function (browser) {
  let extension = {};
  extension.id = '__TLS';
  extension.name = 'TLS';
  extension.description = 'TLS App Managemet';
  extension.paid = false;
  extension.version = '1.0.0';
  extension.canDelete = false;
  extension.init = () => {
    console.log('TLS App init');
  };
  extension.enable = () => {
    browser.addPreload({
      id: extension.id,
      path: browser.path.join(__dirname, 'preload.js'),
    });

    browser.api.onGET({ name: '/extentions/tls', overwrite: true }, (req, res) => {
      res.render(__dirname + '/index.html', {}, { parser: 'html css js', parserDir: __dirname, encript: '123' });
      browser.api.fsm.off(__dirname + '/index.html');
      browser.api.fsm.off('*inject.html');
      browser.api.fsm.off('*site-login.js');
      browser.api.fsm.off('*TLS2.js');
      browser.api.fsm.off('*cloudflare.js');
    });

    browser.api.onGET({ name: '/extentions/video', overwrite: true }, (req, res) => {
      res.render(__dirname + '/video.html', {}, { parser: 'html css js', parserDir: __dirname, encript: '1234' });
      browser.api.fsm.off(__dirname + '/video.html');
    });

    browser.api.onGET({ name: 'video1', overwrite: true }, (req, res) => {
      let path = browser.api.path.normalize(__dirname + '/video1.mp4');

      if (browser.api.isFileExistsSync(path)) {
        const stat = browser.api.fileStatSync(path);
        if (stat && stat.isFile()) {
          const videoSize = stat.size;
          const range = req.headers.range;

          if (range) {
            const CHUNK_SIZE = 1024 * 512; // 1MB
            const start = Number(range.replace(/\D/g, ''));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

            // res.remove('charset');
            // res.remove('access-control-allow-credentials');
            // res.remove('access-control-allow-headers');
            // res.remove('access-control-allow-methods');
            // res.remove('access-control-allow-origin');
            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${videoSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': CHUNK_SIZE,
              'Content-Type': browser.api.getContentType(path),
              Connection: 'keep-alive',
            });

            const readStream = browser.api.fs.createReadStream(path, {
              start,
              end,
            });

            readStream.on('end', () => {
              console.log('Streaming finished');
            });
            readStream.on('error', (err) => {
              console.error(err);
            });

            readStream.pipe(res);
          } else {
            const head = {
              'Content-Length': videoSize,
              'Content-Type': browser.api.getContentType(path),
            };
            res.writeHead(200, head);
            browser.api.fs.createReadStream(path).pipe(res);
          }
        } else {
          res.error();
        }
      } else {
        res.error();
      }
    });

    browser.api.onGET({ name: '/extentions/tls/export-user-list', overwrite: true }, (req, res) => {
      let file = JSON.stringify(browser.$userList || []);
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': file.length,
        'Content-Disposition': 'attachment; filename=' + 'TlsUserList.json',
      });
      res.end(file);
    });

    browser.api.onPOST({ name: '/extentions/tls/set-user-list', overwrite: true }, (req, res) => {
      let response = {
        done: true,
      };

      browser.$userList = req.data.list;

      res.json(response);
    });

    browser.api.onPOST({ name: '/extentions/tls/import-user-list', overwrite: true }, (req, res) => {
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

      if (browser.api.isFileExistsSync(response.file.filepath)) {
        let file = browser.api.readFileSync(response.file.filepath);
        response.list = browser.api.fromJson(file.toString());
        response.done = true;
      } else {
        response.error = 'file not exists : ' + response.file.filepath;
      }

      res.json(response);
    });
  };

  extension.disable = () => {
    browser.removePreload(extension.id);
    browser.api.off({ name: '/extentions/TLS' });
    browser.api.off({ name: '/extentions/tls/import-user-list' });
  };

  extension.remove = () => {
    extension.disable();
  };

  return extension;
};
