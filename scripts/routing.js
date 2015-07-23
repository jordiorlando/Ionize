window.addEventListener('WebComponentsReady', function() {
  page('/', function () {
    app.route = 'project';
  });

  page('/layout', function () {
    app.route = 'layout';
  });

  page('/keyset', function () {
    app.route = 'keyset';
  });

  page('/keymap', function () {
    app.route = 'keymap';
  });

  // Do add #! before urls
  page({
    hashbang: true
  });
});
