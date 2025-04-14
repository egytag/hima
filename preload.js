module.exports = function (SOCIALBROWSER) {
    if (document.location.href.like('*tlscontact.com*|*extentions/TLS*')) {
        SOCIALBROWSER.var.blocking.open_list = [];

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
};
