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

  page('/firmware', function () {
    app.route = 'firmware';
  });

  // Do add #! before urls
  page({
    hashbang: true
  });
});
