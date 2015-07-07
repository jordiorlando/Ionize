(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    app.renderLayout();
    console.log('Bindings have been resolved, content is loaded');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  app.searchAction = function() {

  };

  app.saveLayout = function() {
    // JSON.stringify($scope.serializedRaw)
    var blob = new Blob(["[\n{This is a layout file}\n]"], {type: "text/plain;charset=utf-8"}); // TODO: make sure hashes are not included
    saveAs(blob, "layout.json");
  };

  app.saveKeyset = function() {
    // JSON.stringify($scope.serializedRaw)
    var blob = new Blob(["[\n{This is a keyset file}\n]"], {type: "text/plain;charset=utf-8"}); // TODO: make sure hashes are not included
    saveAs(blob, "keyset.json");
  };

  app.serialize = function() {
    var temp = [
      ["Num Lock","/","*","-"],
      ["7\nHome","8\n↑","9\nPgUp",{"h":2},"+"],
      ["4\n←","5","6\n→"],
      ["1\nEnd","2\n↓","3\nPgDn",{"h":2},"Enter"],
      [{"w":2},"0\nIns",".\nDel"]
    ];

    return JSON.stringify(temp);
  };

  app.deserialize = function(serialized) {
    return JSON.parse("serialized");
  };

  app.renderLayout = function() {
    var container = document.querySelector("#kbContainer");
    container.style.width = "100%";
    container.style.display = "flex";
    container.style.justifyContent = "flex-start";

    var keys = [
      {}
    ];

    keys.forEach(function(key) {
      key.html = document.createElement("div");
      key.html.style.height = "100px";
      key.html.style.width = "100px";
      key.html.style.display = "flex";
      key.html.style.alignItems = "center";
      key.html.style.justifyContent = "center";

      var keyBG = document.createElement("div");
      keyBG.style.height = "90%";
      keyBG.style.width = "90%";
      keyBG.style.backgroundColor = "#FF4081";
      keyBG.style.border = "1px solid #795548";
      keyBG.style.borderRadius = "10%";

      key.html.appendChild(keyBG);

      container.appendChild(key.html);
    });
  };
})(document);
