(function(document) {
  'use strict';

  var unit = 94; // Size in px of 1U
  var color = "#DDD"; // Color for keys

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.layout = {};

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
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
    var blob = new Blob([JSON.stringify(app.layout, null, 2)], {type: "text/plain;charset=utf-8"}); // TODO: make sure hashes are not included
    saveAs(blob, "layout.json");
  };

  app.loadLayout = function() {
    $.getJSON("../presets/layouts/60.json", function( data ) {
      app.layout = data;
      app.renderLayout();
    });
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

  app.addKey = function() {
    var key = {
      "k": "",
      "x": 4,
      "y": 6,
      "w": 1,
      "h": 1,
      "r": 0
    };
    key.k = "NEW<br>" + app.layout.keys.length;

    var container = document.querySelector("#kbContainer");
    container.appendChild(app.keyHTML(key, app.layout.keys.length));

    app.layout.keys.push(key);
  };

  app.renderLayout = function() {
    var container = document.querySelector("#kbContainer");
    container.innerHTML = null;
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.display = "flex";
    container.style.justifyContent = "flex-start";
    container.style.flexWrap="wrap";
    //container.style.display = "inline-block";
    //container.style.border = "1px solid #000";

    for (var k in app.layout.keys) {
      container.appendChild(app.keyHTML(app.layout.keys[k], k));
    }
  };

  app.keyHTML = function(key, k) {
    var html = document.createElement("div");
    html.id = "key_" + k;
    //html.style.position = "relative";
    html.style.display = "flex";
    html.style.alignItems = "center";
    html.style.justifyContent = "center";
    html.style.left = (key.x * unit) + "px";
    html.style.top = (key.y * unit) + "px";
    html.style.width = (key.w * unit) + "px";
    html.style.height = (key.h * unit) + "px";

    var keyBG = document.createElement("div");
    keyBG.style.display = "flex";
    keyBG.style.alignItems = "center";
    keyBG.style.justifyContent = "center";
    keyBG.style.width = ((key.w * unit) - (unit * 2.5 / 75)) + "px";
    keyBG.style.height = ((key.h * unit) - (unit * 2.5 / 75)) + "px";
    keyBG.style.backgroundColor = color;
    keyBG.style.border = "1px solid #888";
    keyBG.style.borderRadius = (unit / 10) + "px";

    var keyFG = document.createElement("div");
    keyBG.style.display = "flex";
    keyBG.style.alignItems = "center";
    keyBG.style.justifyContent = "center";
    keyFG.style.width = ((key.w * unit) - (unit * 20 / 75)) + "px";
    keyFG.style.height = ((key.h * unit) - (unit * 20 / 75)) + "px";
    keyFG.style.backgroundColor = "#FFF";
    keyFG.style.border = "1px solid #BBB";
    keyFG.style.borderRadius = (unit / 10) + "px";

    var keyName = document.createElement("div");
    //keyName.style.width = "100%";
    //keyName.style.height = "100%";
    keyName.style.textAlign = "center";
    keyName.innerHTML = "<br>" + key.k;

    keyFG.appendChild(keyName);
    keyBG.appendChild(keyFG);
    html.appendChild(keyBG);

    return html;
  };
})(document);
