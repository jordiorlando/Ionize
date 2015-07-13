var app = document.querySelector('#app');

app.unitSize = 100; // Size in px of 1U
var color = "#DDD"; // Color for keys
var layout = {};

app.saveLayout = function() {
  var blob = new Blob([serialize(layout)], {type: "text/plain;charset=utf-8"}); // TODO: make sure hashes are not included
  saveAs(blob, "layout.json");
};

app.loadLayout = function() {

};

app.loadPreset = function() {
  $.getJSON("../presets/layouts/60.json", function( data ) {
    layout = data;
    renderLayout();
  });
};

app.addKey = function() {
  var key = {
    "k": "",
    "x": 0,
    "y": 0,
    "w": 1,
    "h": 1,
    "r": 0
  };

  var container = document.querySelector("#layoutContainer");
  var numKeys = layout.keys.length;
  var lastKey = layout.keys[numKeys - 1];
  if ((lastKey.x + lastKey.w) > 14) {
    key.x = 0;
    key.y = lastKey.y + 1;

    container.style.height = ((key.y + key.h) * app.unitSize) + "px";
  } else {
    key.x = lastKey.x + lastKey.w;
    key.y = lastKey.y;
  }

  key.k = "NEW<br>" + numKeys;
  layout.keys.push(key);

  container.appendChild(keyHTML.create(numKeys));
  keyHTML.update(numKeys);
};



var serialize = function(obj) {
  return JSON.stringify(obj, null, 2);
};

var deserialize = function(serialized) {
  return JSON.parse("serialized");
};

var renderLayout = function() {
  document.querySelector("#layout").innerHTML = "<paper-material elevation=\"1\" style=\"position: absolute; margin: 16px; padding: 25px;\" id=\"layoutContainer\"></paper-material>";
  var container = document.querySelector("#layoutContainer");
  container.innerHTML = null;

  for (var k in layout.keys) {
    container.appendChild(keyHTML.create(k));
    keyHTML.update(k);
  }
  container.style.width = (15 * app.unitSize) + "px";
  container.style.height = (5 * app.unitSize) + "px";
};

var updateLayout = function() {
  for (var k in layout.keys) {
    keyHTML.update(k);
  }
};

var keyHTML = function() {

};

keyHTML.create = function(k) {
  var html = document.createElement("div");
  html.id = "key_" + k;
  html.className = "key";
  html.style.position = "absolute";
  html.style.display = "flex";
  html.style.alignItems = "center";
  html.style.justifyContent = "center";
  //html.style.left = (key.x * app.unitSize) + "px";
  //html.style.top = (key.y * app.unitSize) + "px";
  html.style.width = app.unitSize + "px";
  html.style.height = app.unitSize + "px";

  var keyBG = document.createElement("div");
  keyBG.className = "keyBG";
  keyBG.style.display = "flex";
  keyBG.style.alignItems = "center";
  keyBG.style.justifyContent = "center";
  keyBG.style.width = (app.unitSize * 72.5 / 75) + "px";
  keyBG.style.height = (app.unitSize * 72.5 / 75) + "px";
  keyBG.style.backgroundColor = color;
  keyBG.style.border = "1px solid #888";
  keyBG.style.borderRadius = (app.unitSize / 10) + "px";

  var keyFG = document.createElement("div");
  keyBG.style.display = "flex";
  keyBG.style.alignItems = "center";
  keyBG.style.justifyContent = "center";
  keyFG.style.width = (app.unitSize * 55 / 75) + "px";
  keyFG.style.height = (app.unitSize * 55 / 75) + "px";
  keyFG.style.backgroundColor = "#FFF";
  keyFG.style.border = "1px solid #BBB";
  keyFG.style.borderRadius = (app.unitSize / 10) + "px";

  var keyName = document.createElement("div");
  //keyName.style.width = "100%";
  //keyName.style.height = "100%";
  keyName.style.textAlign = "center";
  keyName.innerHTML = "NEW<br>" + k;

  keyFG.appendChild(keyName);
  keyBG.appendChild(keyFG);
  html.appendChild(keyBG);

  keyBG.addEventListener("click", function(){keyHTML.onClick(html.id)}, false);

  return html;
};

keyHTML.update = function(k) {
  var key = layout.keys[k];
  var html = document.querySelector("#key_" + k);
  html.style.left = ((key.x + 0.25) * app.unitSize) + "px";
  html.style.top = ((key.y + 0.25) * app.unitSize) + "px";
  html.style.width = (key.w * app.unitSize) + "px";
  html.style.height = (key.h * app.unitSize) + "px";

  var keyBG = html.firstElementChild;
  keyBG.style.width = ((key.w * app.unitSize) - (app.unitSize * 2.5 / 75)) + "px";
  keyBG.style.height = ((key.h * app.unitSize) - (app.unitSize * 2.5 / 75)) + "px";

  var keyFG = keyBG.firstElementChild;
  keyFG.style.width = ((key.w * app.unitSize) - (app.unitSize * 20 / 75)) + "px";
  keyFG.style.height = ((key.h * app.unitSize) - (app.unitSize * 20 / 75)) + "px";

  var keyName = keyFG.firstElementChild;
  keyName.innerHTML = key.k;
};

keyHTML.onClick = function(id) {
  var prevKey = document.querySelector(".selected");
  if (prevKey !== null) {
    prevKey.className = null;
    prevKey.firstElementChild.style.border = "1px solid #888";
  }

  var key = document.querySelector("#" + id);
  key.className = "selected";
  key.firstElementChild.style.border = "1px solid #0F0";
};

/*$(".key").hover(function() {
  $(this).style.border = "1px solid #000";
}, function() {
  $(this).style.borderStyle = "none";
});*/
